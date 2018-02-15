import { unsetToken } from '@lib/util'

const clientStrategy = {
    '^401$'(data){
        //TODO:重新login并getUserInfo
        unsetToken()
        wx.reLaunch({
            url: '../../common/pages/auth'
        })
    },
    '^403$'(data){
        //TODO:重定向至首页
        wx.reLaunch({
            url: '../../home/pages/index'
        })
    },
    '^404$'(data){
        //TODO:报服务器升级中
        let content = '服务器升级中...'
        try {
            const body = JSON.parse(xhr.responseText)
            content += `\n${body.message}`
        } catch (error) {
            
        }
        wx.showModal({
            title: '提示',
            content,
        })
    },
    '^50\\d{1}$'(data){
        //TODO:报服务器升级中且log报错信息
        let content = '服务器升级中...'
        try {
            const body = JSON.parse(xhr.responseText)
            content += `\n${body.message}`
        } catch (error) {
            
        }
        wx.showModal({
            title: '提示',
            content,
        })        
    }
}

export function clientContext(data, status){
    for (const key in clientStrategy) {
        const isMatched = new RegExp(key).test(status)
        if(isMatched){
            clientStrategy[key](data)
            break
        }
    }
}