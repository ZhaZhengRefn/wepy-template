import wepy from 'wepy'
import { TOKEN } from '@config/constant'
import { getJWT, setToken } from '@lib/util'
import { globalEvent } from '@lib/event'

export default class AuthMixin extends wepy.mixin {

    authorize(){
        return new Promise((resolve, reject) => {
            let currentToken = ''
            this.loginForCode()
            .then(code => {
              return this.codeForToken(code)
            })
            .then(({ token, auth }) => {
              currentToken = token
              setToken(token)
              globalEvent.emit('hangingApi')
              return this.getEncryptedData()
            })
            .then(res => {
              if(!res){
                resolve(false)//下一步openSetting
                // throw new Error('USER DENY')
              } else {
                res = Object.assign(res, { token: currentToken })
                return this.dataForUserInfo(res)
              }
            })
            .then(res => {
                resolve(true)//下一步授权成功
            })
            .catch(e => {
              console.log('login error, ',e)
            })             
        })        
    }

    loginForCode(){
        return new Promise((resolve, reject) => {
          wepy.login()
          .then(res => {
            resolve(res.code)
          })
          .catch(e => {
            reject(e)
          })      
        })
    }

    codeForToken(code){
        return new Promise((resolve, reject) => {
          this.$parent.apis.login({code})
          .then(
          ({ 
            data: {
              token,
              auth
            }
          }) => {
            resolve({ token, auth })
          })
          .catch(e => {
            reject(e)
          })
        })
    }
      
    getEncryptedData() {
        return new Promise((resolve, reject) => {
          wepy.getUserInfo()
          .then(res => {
            if(!res) {
              resolve(false)
            } else {
              resolve(res)
            }
          })
          .catch(e => {
            resolve(false)
          })      
        })
    }
      
    dataForUserInfo({ token, encryptedData: encrypted_data, iv }){
        return new Promise((resolve, reject) => {
          this.$parent.apis.loginInfo({ token, encrypted_data, iv })
          .then(res => {
            resolve(res)
          })      
          .catch(e => {
            reject(e)
          })
        })
    }    

  onShow() {
    // console.log('mixin onShow')
  }

  onLoad() {
    // console.log('mixin onLoad')
  }
}
