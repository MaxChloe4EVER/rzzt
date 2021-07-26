// 权限拦截 导航守卫 路由守卫  router
import router from '@/router' // 引入路由实例
import store from '@/store' // 引入vuex store实例
import NProgress from 'nprogress' // 引入一份进度条插件
import 'nprogress/nprogress.css' // 引入进度条样式

const whiteList = ['/login', '/404'] // 设置白名单，这些路由不需要权限也能访问

router.beforeEach(function(to, from, next) {
  // 跳转页面时进度条开启
  NProgress.start()
  if (store.getters.token) {
    if (to.path === '/login') {
      next('/') // 当通过了导航守卫后需要跳转到哪个路由
    } else {
      next() // 直接跳转到需要访问的页面
    }
  } else {
    if (whiteList.indexOf(to.path) > -1) {
      // 如果访问的页面在白名单内，则直接放行
      next()
    } else {
      // 如果不在白名单内，则跳转至登录页
      next('/login')
    }
  }
  // 监听手动跳转页面时将进度条关闭
  NProgress.done()
})

router.afterEach(function(to, from, next) {
  // 跳转完成后将进度条关闭，但他监听不到手动跳转页面的操作
  // 因此在27行设置监听手动跳转页面
  NProgress.done()
})
