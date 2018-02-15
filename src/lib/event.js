class Emitter {
    constructor() {
      this._events = {}
      this._middles = {}
    }
  
    on(type, fn){
      if(!this._events[type]){
        this._events[type] = []
      }
  
      this._events[type].push(fn)
    }
  
    emit(type, ...args){
  
      const middle = this._middles[type]
  
      if(middle){
  
        function wrapNext(m){//return function适用于不立刻执行函数，需要保留对参数的引用
          return function(){
            if(m.next){
              m.next(args, wrapNext(m.next))
            }
          }
        }
  
        middle(args, wrapNext(middle))
      }
  
      const events = this._events[type]
  
      if(!events || events.length === 0) return
      events.forEach(fn => fn.apply(this, args))
    }
  
    remove(type, fn){
      let fns = this._events[type]
  
      if(!fns || fns.length === 0) return
  
      for(let i = fns.length - 1; i >= 0; i--){
        if(fns[i] === fn){
          fns.splice(i, 1)
          break
        }
      }
    }
  
    use(type, middle){
      const list = this._middles[type]
  
      if(!list){
        this._middles[type] = middle
        return
      }
  
      let current = list
      while(current.next){
        current = current.next
      }
  
      current.next = middle
    }
  }
  
export const Event = Emitter

export const globalEvent = new Emitter()