
import Link from './router-link'
import View from './router-view'

let Vue

class SRouter  {
  static install(_Vue){
    Vue = _Vue
    Vue.mixin({
      'beforeCreate': function (){
        if(this.$options.router){
          Vue.prototype.$router = this.$options.router
        }
      }
    })
 
    Vue.component('router-link', Link)
    Vue.component('router-view', View)
  }
  constructor(options) {
    this.$options = options
    this.current = location.hash.slice(1) || '/'
    // Vue.util.defineReactive(this,'current',initial)
    Vue.util.defineReactive(this,'matched',[])
    this.match()
    window.addEventListener('hashchange', this.hashchange.bind(this))
    window.addEventListener('load', this.hashchange.bind(this))
  }
  hashchange(){
    this.current = location.hash.slice(1) || '/'
    this.matched = []
    this.match()
  }
  match(routes){
    routes = routes || this.$options.routes
    for(let route of routes){
      if(route.path === '/' && this.current === '/'){
        this.matched.push(route)
        return
      }
      // eslint-disable-next-line no-console
      if(route.path !== '/' && this.current.indexOf(route.path) != -1){
        this.matched.push(route)
        if(route.children){
          this.match(route.children)
        }
        return
      }
    }
  }
}
export default SRouter