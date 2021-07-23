function defineReactive(obj, key, val){
  observe(val)
  const dep  = new Dep()
  Object.defineProperty(obj, key, {
    get(){
      if(Dep.target){
        dep.addDep(Dep.target)
      }
      return val
    },
    set(newVal){
      if(newVal != val){
        val = newVal;
        // if(typeof newVal === 'object'){
        //   observe(newVal)
        // }
        dep.notify()
      }
    }
  })
}

function observe(obj){
  if(typeof obj !== 'object' || obj === null) return;
  new Observer(obj)
}

class Observer {
  constructor(obj){
    this.value = obj
    if(Array.isArray(obj)){

    }else {
      this.walk(obj)
    }
    
  }
  walk(obj){
    Object.keys(obj).forEach(key => {
      defineReactive(obj, key, obj[key]);
    })
  }
}

function proxy(vm){
  Object.keys(vm.$data).forEach(key =>{
    Object.defineProperty(vm, key, {
      get(){
        return vm.$data[key];
      },
      set(val){
        vm.$data[key] = val
      }
    })
  })
}

class SVue {
  constructor(options){
    //响应式

    this.$options = options;
    this.$data = options.data
    observe(this.$data)
    //代理
    proxy(this)
    //编译
    new Compile(options.el, this)
  }
}

class Compile {
  constructor(el, vm){
    this.$vm = vm

    //遍历
    this.$el = document.querySelector(el)
    this.compile(this.$el)
  }
  compile(el){
    el.childNodes.forEach(node => {
      if(node.nodeType === 1){
        this.compileElement(node)

        if(node.childNodes.length > 0){
          this.compile(node)
        }

      }else if(this.isInter(node)){
        this.compileText(node)
      }
    })
  }
  isInter(node){
    return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent)
  }
  idDir(attr){
    return (attr).startsWith("s-")
  }
  isMethod(attr){
    return attr.startsWith('@')
  }
  compileElement(node){
    const nodeAttrs = Array.from(node.attributes)
    nodeAttrs.forEach(attr => {
      const attrName = attr.name
      const attrValue = attr.value
      if(this.isMethod(attrName)){
        const method = attrName.substring(1)
        this[method] && (this[method](node, method, attrValue))
      }else if(this.idDir(attrName)){
        const dir = attrName.substring(2)
        this[dir] && (this[dir](node, attrValue))
        
      }
    })
  }
  //先给节点设置，然后更新v-model绑定的值
  model(node, exp){
    node.value = this.$vm[exp]
    function modelFn(e){
      this.$vm[exp] = e.target.value
      this.update(node, exp, 'model')
    }
    node.addEventListener('input',modelFn.bind(this))
  }
  modelUpdater(node, val){
    node.value = val
  }
  click(node, method, val){
   const pulsOne = '++'
   function clickFn(){
    if(val.endsWith(pulsOne)){
      const key = val.slice(0, -2)
      const value = this.$vm[key]++
      this.update(key, value,)
    }

   }
   node.addEventListener(method, clickFn.bind(this))
  }


  update(node, exp, dir){
    const fn = this[dir + 'Updater']
    fn && fn(node, this.$vm[exp])
    new Watcher(this.$vm, exp, function(val){
      fn && fn(node, val)
    })
  }
  html(node, exp){
    this.update(node, exp, 'html')
  }
  htmlUpdater(node, val){
    node.innerHTML = val
  }
  compileText(node){
    this.update(node, RegExp.$1, 'text')
    node.textContent = this.$vm[RegExp.$1]
  }

  text(node, exp){
    node.textContent = this.$vm[exp]
    this.update(node, RegExp.$1, 'text')
  }
  textUpdater(node, val){
    node.textContent = val
  }
}

class Watcher {
  constructor(vm, key, updateFn){
    this.vm = vm 
    this.key = key
    this.updateFn = updateFn
    Dep.target = this
    this.vm[key]
    Dep.target = null
  }
  update(){
    this.updateFn.call(this.vm, this.vm[this.key])
  }
}

class Dep{
  constructor(){
    this.deps = []
  }
  addDep(dep){
    this.deps.push(dep)
  }
  notify(){
    this.deps.forEach(dep=>dep.update())
  }
}