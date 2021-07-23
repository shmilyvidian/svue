
function defineReactive(obj, key, val){
  observe(val)
  Object.defineProperty(obj, key, {
    get(){
      console.log(key, 'get', val);
      return val
    },
    set(newVal){
      if(newVal != val){
        console.log(key, 'set', newVal);
        val = newVal;
        // if(typeof newVal === 'object'){
        //   observe(newVal)
        // }
      }
    }
  })
}

function observe(obj){
  if(typeof obj !== 'object' || obj === null) return;
  Object.keys(obj).forEach(key => {
    if(Array.isArray(obj[key]))
    defineReactive(obj, key, obj[key]);
  })
}

function observeArray(val){

}

function set(obj, key, val){
  defineReactive(obj, key, val)
}

const obj = {
  foo: 'foo',
  bar: 'bar',
  baz: {
    a: 1
  }
}
observe(obj)
set(obj, 'dong', 'dong')
obj.foo
obj.bar = {
  s: 1
}
obj.baz
// obj.baz.a = '3'
// obj.dong