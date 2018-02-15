const fs = require('fs')
const path = require('path')

const routeDest = path.join(__dirname, '../src/config/routes.js')
const apisDest = path.join(__dirname, '../src/config/apisConf.js')
const modulesPath = path.join(__dirname, '../src/modules')

let routes = []

let apis = {}

fs.readdirSync(modulesPath).forEach(module => {
    if(module.indexOf('.DS_Store') > -1) return 

    const route = require(`${modulesPath}/${module}/route`)
    route.forEach(item => {
        item.page = `modules/${module}/pages/${item.page.match(/\/?(.*)/)[1]}`
    })
    routes = routes.concat(route)

    const api = require(`${modulesPath}/${module}/apis`)
    apis = Object.assign(apis, api)
})

fs.writeFileSync(routeDest,`module.exports = ${JSON.stringify(routes)}`, e => {
    console.log(e)
})

fs.writeFileSync(apisDest, `export default ${JSON.stringify(apis)}`, e => {
    console.log(e)
})