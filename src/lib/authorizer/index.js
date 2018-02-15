import wepy from 'wepy'
import { TOKEN } from '@config/constant'
import { getJWT, setToken } from '@lib/util'
import { globalEvent } from '@lib/event'
import { login, loginInfo } from './request'

export default class Authorizer {
    constructor(wp){
        this.wepy = wp
        this.token = ''
        this.events = []
        this.isRunning = false

        this.authorizeHandler = this.authorizeHandler.bind(this)
        this.errorHandler = this.errorHandler.bind(this)

        this.run = mode => {
            if(this.isRunning){
                return this.subscribe()
            }
            const handler = this.errorHandler(mode).bind(this)
            return this.authorizeHandler(mode, handler)
        }

        this.subscribe = () => {
            const eventName = `tokenEvent-${Date.now()}`
            return new Promise((resolve, reject) => {
                this.events.push({
                    event: eventName,
                    fn: (...params) => { resolve(eventName, ...params) }
                })
            })
        }

        this.emit = () => {
            while(this.events.length > 0){
                const e = this.events[this.events.length - 1]
                if(e.fn && Object.prototype.toString.call(e.fn) === '[object Function]'){
                    e.fn(this.token)
                }
                this.events.pop()
            }
        }
    }

    entryModeStrategies = {
        'USER DENY'() {
            wx.redirectTo({ url: '../../common/pages/auth' })
        },
        'NO NEED FOR USERINFO'() {
            setToken(this.token)//缓存token
            // globalEvent.emit('hangingApi')//重启挂起的api请求  
            this.emit.call(this)
        },
    }

    authPageModeStrategies = {
        'USER DENY'() {
            this._openSetting()
            .then(res => {
                return this.run(2)
            })
            .catch(e => {
                globalEvent.emit('authFailToast')
            })
        },
        'NO NEED FOR USERINFO'() {
            setToken(this.token)//缓存token
            // globalEvent.emit('hangingApi')//重启挂起的api请求  
            this.emit.call(this)
            wx.showToast({
                title: '授权成功',
                icon: 'success',
                duration: 1200
            })            
            wx.redirectTo({ url: '../../home/pages/index' })
        }
    }

    errorStrategiesContext(mode, defaultFn = () => { console.log('defaultFn') }){
        const CONTEXT = {
            1: this.entryModeStrategies,
            2: this.authPageModeStrategies
        }
        //TODO:优化defaultFn
        if(mode === 2){
            defaultFn = () => globalEvent.emit('authFailToast')
        }        
        return CONTEXT[mode] || defaultFn
    }

    errorHandler(mode = 1){
        return function(err, result){
            if(!err) return
            if(Object.prototype.toString.call(err) === '[object Function]'){
                err = err()
            }

            console.warn(err.message)
            const s = this.errorStrategiesContext(mode)
            s[err.message] && s[err.message].call(this)            
        }
    }

    async entryProcess(){
        const code = await this._loginForCode()

        const { token, auth } = await this._codeForToken(code)
        //TODO:!!!!!!!
            .catch(err => Promise.reject(() => {
                if(err.message === 'No Auth'){//无须更新用户信息
                    this.token = err.token
                    return new Error('NO NEED FOR USERINFO')
                } else {
                    return err
                }
            }))
        if(token && token.length > 0){
            this.token = token
            setToken(this.token)//缓存token
            // globalEvent.emit('hangingApi')//重启挂起的api请求              
            this.emit.call(this)
        }            

        let encryptedData = await this._getEncryptedData()
            .catch(err => Promise.reject(() => {
                if(err.message === 'USER DENY'){//用户拒绝授权
                    return new Error('USER DENY')
                } else {
                    return err
                }
            }))
        encryptedData = Object.assign(encryptedData, { token })

        const result = await this._dataForUserInfo(encryptedData)

        wx.showToast({
            title: '授权成功',
            icon: 'success',
            duration: 1200
        })

        return result
    }

    async authPageProcess(){
        const code = await this._loginForCode()

        const { token, auth } = await this._codeForToken(code)
            .catch(err => Promise.reject(() => {
                if(err.message === 'No Auth'){//无须更新用户信息
                    this.token = err.token
                    return new Error('NO NEED FOR USERINFO')
                } else {
                    return err
                }
            }))
        
        if(token && token.length > 0){
            this.token = token
            setToken(this.token)//缓存token
            // globalEvent.emit('hangingApi')//重启挂起的api请求              
            this.emit.call(this)
        }

        let encryptedData = await this._getEncryptedData()
            .catch(err => Promise.reject(() => {
                if(err.message === 'USER DENY'){//用户拒绝授权
                    return new Error('USER DENY')
                } else {
                    return err
                }
            }))
        encryptedData = Object.assign(encryptedData, { token })

        const result = await this._dataForUserInfo(encryptedData)

        wx.showToast({
            title: '授权成功',
            icon: 'success',
            duration: 1200
        })
        
        setTimeout(() => {
            wx.reLaunch({
                url: '../../home/pages/index'
            })
        }, 1400)

        return result
    }

    processContext(mode = 1, defaultFn = () => { console.log('defaultFn') }){
        const CONTEXT = {
            1: this.entryProcess,
            2: this.authPageProcess
        }        
        return CONTEXT[mode] || defaultFn
    }

    async authorizeHandler(mode, handler){//开始授权流程
        const processFn = this.processContext(mode).bind(this)

        try {
            console.log('try--isRunning', this.isRunning)
            this.isRunning = true
            wx.showLoading()
            handler(null, await processFn.call(this))
        } catch (error) {
            handler(error)
        } finally {
            console.log('finally--isRunning', this.isRunning)
            this.isRunning = false
            wx.hideLoading()
        }
    }

    async _openSetting(){
        const { authSetting } = await this.wepy.getSetting()
        if(authSetting.hasOwnProperty('scope.userInfo') && authSetting['scope.userInfo'] === false){
            const { authSetting } = await this.wepy.openSetting()
            if(authSetting['scope.userInfo'] === false){
                console.warn('用户拒绝授权')
                throw new Error('USER DENY')
            } else if(authSetting['scope.userInfo'] === true){
                console.warn('用户第二次授权成功')
            }
            return authSetting
        }
        console.log('首次授权')
        return authSetting
    }    

    _loginForCode() {
        return new Promise((resolve, reject) => {
          this.wepy.login().then(res => {
            resolve(res.code)
          }).catch(e => {
            reject(e)
          })
        })
    }    

    _codeForToken(code) {
        return new Promise((resolve, reject) => {
            login({ code }).then(({
                data: {
                    token,
                    auth
                }
            }) => {
                if(auth === false){
                    const err = new Error('No Auth')
                    err.token = token
                    reject(err)
                } else if(!token){
                    reject(new Error('invalid code'))
                } else {
                    resolve({ token, auth })
                }
            }).catch(e => {
                reject(e)
            })
        })
    }    

    _getEncryptedData() {
        return new Promise((resolve, reject) => {
          this.wepy.getUserInfo().then(res => {
            if (!res) {
              reject(new Error('USER DENY'))
            } else {
              resolve(res)
            }
          }).catch(e => {
            reject(new Error('USER DENY'))
          })
        })
      }
    
    _dataForUserInfo({ token, encryptedData: encrypted_data, iv }) {
        return new Promise((resolve, reject) => {
          loginInfo({ token, encrypted_data, iv }).then(res => {
            resolve(res)
          }).catch(e => {
            reject(e)
          })
        })
    }    
}

export const GlobalAuth = new Authorizer(wepy)