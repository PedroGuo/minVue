class Observer {
  constructor(data) {
      this.walk(data)
  }
  walk (data) { // 循环执行data
      if (!data || typeof data !== 'object') {
          return
      }
      Object.keys(data).forEach(key => {
          this.defineReactive(data, key, data[key])
      })
  }
  defineReactive (obj, key, val) { // 将对象变成响应式
      let that = this
      this.walk(val) // 如果val是对象，把内部也具有get\set
      let dep = new Dep() // 1、创建被观察者
      Object.defineProperty(obj, key, {
          configurable: true,
          enumerable: true,
          get() {
              Dep.target && dep.addSub(Dep.target)  //2、添加观察者
              return val // 如果使用obj[key]，会变成死循环
          },
          set(newValue) {
              if (newValue === val) {
                  return
              }
              val = newValue
               // 修改后可能是对象，set函数内部调用，修改了this指向
              that.walk(newValue)
              dep.notify() // 3、通知观察者
          }
      })
  }
}