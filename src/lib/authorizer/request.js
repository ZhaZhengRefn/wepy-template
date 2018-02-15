import { HOST } from '@config/constant'

function requestFactory(urlPath, data, method = 'GET'){
    return function(resolve, reject){
        const url = `${HOST}${urlPath}`
        wx.request({
            url,
            data,
            method,
            success({ data, statusCode, header }) {
                if(statusCode >= 200 && statusCode < 300 || statusCode == 304){
                    resolve(data)
                } else {
                    reject(data)
                }
            },
            fail(res){
                reject(res)
            }        
        })
    }
}

export function login({ code }) {
    const r = requestFactory(`/login`, { code }, 'POST')
    return new Promise((resolve, reject) => {
        r(resolve, reject)
    })
}

export function loginInfo({ token, encrypted_data, iv }){
    const r = requestFactory(`/login/info`, { token, encrypted_data, iv }, 'POST')
    return new Promise((resolve, reject) => {
        r(resolve, reject)
    })
}