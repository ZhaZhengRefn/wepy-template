/**
 * @author zhazheng
 * @description 在wepy编译前预编译。获取app.wpy内的pages字段，并替换成已生成的路由表。
 */
const babel = require('babel-core')
const t = require('babel-types')

//1.引入路由
const Strategies = require('../src/lib/routes-model')
const routes = Strategies.sortByWeight(require('../src/config/routes'))
const pages = routes.map(item => item.page)

//2.解析script标签内的js，获取code
const xmldom = require('xmldom')
const fs = require('fs')
const path = require('path')

const appFile = path.join(__dirname, '../src/app.wpy')
const fileContent = fs.readFileSync(appFile, { encoding: 'UTF-8' })
let xml = new xmldom.DOMParser().parseFromString(fileContent)

function getCodeFromScript(xml){
    let code = ''
    Array.prototype.slice.call(xml.childNodes || []).forEach(child => {
        if(child.nodeName === 'script'){
            Array.prototype.slice.call(child.childNodes || []).forEach(c => {
                code += c.toString()
            })
        }
    })
    return code
}
const code = getCodeFromScript(xml)

// 3.嵌套三层visitor
//3.1.找class，父类为wepy.app
const appClassVisitor = {
    Class: {
        enter(path, state) {
            const classDeclaration = path.get('superClass')
            if(classDeclaration.matchesPattern('wepy.app')){
                path.traverse(configVisitor, state)
            }
        }
    }
}
//3.2.找config
const configVisitor = {
    ObjectExpression: {
        enter(path, state){
            const expr = path.parentPath.node
            // const isAssignment = t.isAssignmentExpression(expr, { operator: "=" })
            if(expr.key && expr.key.name === 'config'){
                path.traverse(pagesVisitor, state)
            }
        }
    }
}
//3.3.找pages，并替换
const pagesVisitor = {
    ObjectProperty: {
        enter(path, { opts }){
            const isPages = path.node.key.name === 'pages'
            if(isPages){
                path.node.value = t.valueToNode(opts.value)
            }
        }
    }
}

// 4.转换并生成code
const result = babel.transform(code, {
    parserOpts: {
        sourceType: 'module',
        plugins: ['classProperties']
    },
    plugins: [
        [{
            visitor: appClassVisitor
        }, {
            value: pages
        }],
    ],
})

// 5.替换源代码
fs.writeFileSync(appFile, fileContent.replace(code, result.code))