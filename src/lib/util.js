import routes from '../config/routes'
import { TOKEN } from '../config/constant'

export function isToday(time){
  const one = 1000*60*60*24
  const now = Date.now()
  const todayTime = now - now%one
  const offset = time - todayTime
  return offset <= one && offset >= 0
}

export function once(fn, thisArg){
  let lock = false
  return function(...args){
    if(lock) return
    lock = true
    return fn.apply(thisArg, args)
  }
}

export function onceInSeconds(fn, thisArg, interval = 2000){
  let lock = false, timer = null
  return function(...args){
    if(lock) return
    if(!timer){
      timer = setTimeout(() => {
        lock = false
        timer = null
      }, interval)
    }    
    lock = true
    return fn.apply(thisArg, args)
  }  
}

  /**
  * 频率控制 返回函数连续调用时，action 执行频率限定为 次 / delay
  * @param wait  {number}    延迟时间，单位毫秒
  * @param fn {function}  请求关联函数，实际应用需要调用的函数
  * @return {function}    返回客户调用函数
  */
export function throttle(fn, wait){
    let previous = 0,
        context,
        args,
        timer = null,
        result,
        later = function(){
          timer = null
          previous = Date.now()
          result = fn.apply(context, args)
          if(!timer) context = args = null
        }
    return function(){
      let remaining = wait - (Date.now() - previous)

      context = this
      args = arguments
      if(remaining <= 0 || remaining > wait){
        clearTimeout(timer)
        previous = Date.now()
        timer = null
        result = fn.apply(context, args)
        if(!timer) context = args = null
      } else if(!timer){
        timer = setTimeout(later, wait)
      }
      return result
    }
}

  /**
  * 空闲控制 返回函数连续调用时，空闲时间必须大于或等于 idle，action 才会执行
  * @param fn {function}  请求关联函数，实际应用需要调用的函数
  * @param interval   {number}    空闲时间，单位毫秒
  * @param immediate {boolean}   设置为ture时，调用触发于开始边界而不是结束边界
  * @return {function}    返回客户调用函数
  */
export function debounce(fn, interval, immediate){
    let timer, previous, later, context, args, result

    later = function(){
      let last = Date.now() - previous

      if(last < interval && last > 0){
        timer = setTimeout(later, interval - last)
      } else {
        timer = null
        result = fn.apply(context, args)
        if(!timer) context = args = null
      }
    }
    return function(){
      context = this
      args = arguments
      previous = Date.now()

      if(!timer) {
        timer = setTimeout(later, interval)
      }
      return result
    }
}

export function navigate(a,b, params){
    const url = relative(a, b)
    wx.navigateTo({
        url,
        params
    })
}

export function isEmpty(obj){
    for(let k in obj){
      if(obj.hasOwnProperty(k)){
        return false
      }
    }
    return true
}

export function after(fn, afterFn){
    return function(){
      let res = fn.apply(this,arguments)
      if(res === 'next'){
        return afterFn.apply(this, arguments)
      }
      return res
    }
}

export function chains(){
    let fn = Array.prototype.slice.call(arguments)
    return fn.reduce((pre, next) => {
      return this.after(pre, next)
    })
}

export function getJWT(){
  const token = wx.getStorageSync(TOKEN)
  return token
}

export function setToken(token){
  wx.setStorageSync(TOKEN, token)
}

export function unsetToken(){
  wx.removeStorageSync(TOKEN)
}

function relative(a,b) {
    a = routes.filter(item => item.name === a.name)[0].page.split('/')
    b = routes.filter(item => item.name === b.name)[0].page.split('/')

    if(a.length !== b.length){
        throw new Error('路径层级必须一致才能比较')
    }

    let splitPoint = 0
    for(let i = 0; i < b.length; i++){
        if(a[i] !== b[i]){
            splitPoint = i
            break
        } else {
            continue
        }
    }
    b = b.slice(splitPoint)

    let result = []

    for (let i = 0; i < b.length - 1; i++) {
        result.push('..')
    }

    return result.concat(b).join('/')
}