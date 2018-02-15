import HttpClient from '../lib/http-client'
import APIs from '../lib/apiz'
import conf from './apisConf'
import { clientContext } from './client-context'
import { getJWT } from '@lib/util'
import { globalEvent } from '@lib/event'
import { HOST } from '@config/constant'
import MiddleClient from '../lib/middle-client'
import {GlobalAuth} from '@lib/authorizer/index'

const common = {
    host: HOST,
    login: {
        path: '/login',
        method: 'POST',
        restful: true
    },
    loginInfo: {
        path: '/login/info',
        method: 'POST',
        restful: true
    },
}

const others = {
    getShareWeek: {
        path: '/time/share/week'
    },
    getShareTotal: {
        path: '/time/share/total'
    },
    getShareToday: {
        path: '/time/share/today'
    },
    getShareTypeDetail: {
        path: '/time/share/event/\\d+',
        // path: 'time/share/event/{type_id}',
        restful: true        
    }    
}

let othersList = Object.keys(others).map(key => {
    if(key !== 'host'){
        return common.host + others[key].path
    }
})

let whiteList = Object.keys(common).map(key => {
    if(key !== 'host'){
        return common.host + common[key].path
    }
})

whiteList = whiteList.concat(othersList)

const apisConf = Object.assign(common, conf)

const client = new MiddleClient( ({data, statusCode}) => clientContext(data, statusCode) )
client.use(async function(opt, next) {
    const token = getJWT()
    opt.header = Object.assign(opt.header || {}, {
        Authorization: token
    })
    const curUrl = opt.url.split('?')[0]
    const isWhiteList = whiteList.some(url => {
        return new RegExp('^' + url + '$').test(curUrl)
    })
    if(!!token || isWhiteList){
        await next()
    } else {
        //await auth
        console.log('await...', opt)
        await GlobalAuth.run()
            .catch(e => {
                console.log(e)
            })
        console.log('emit...', opt)
        //set token
        const token = getJWT()
        opt.header = Object.assign(opt.header || {}, {
            Authorization: token
        })
        //next
        await next()
        console.log('complete...', opt)
    }
})

const apis = new APIs(apisConf, client)

export default apis