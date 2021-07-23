export default {
  render(h){
    let parent = this.$parent
    this.$vnode.data.routerView = true
    // console.log(this.$el,'this.$vnode.data',this.$vnode.data.routerView)
    let depth = 0
    while(parent){
      const vnodeData = (parent.$vnode && parent.$vnode.data) || {}
      if(vnodeData && vnodeData.routerView){
        depth++
      }
      console.log(parent.$el,'parent',vnodeData.routerView)
      parent = parent.$parent
    }
    let component = null;
    const route = this.$router.matched[depth];

    if(route){
      component = route.component
    }
    return h(component)
  }
}