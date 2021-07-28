// 导出一个axios的实例  而且这个实例要有请求拦截器 响应拦截器
import axios from 'axios'

import router from '@/router'

import store from '@/store'

// 导入存取时间戳的方法
import { getTimeStamp } from '@/utils/auth'
// 设置超时时间 1小时
const TimeOut = 3600

// 单独引入elementUI中的 Message 提醒
import { Message } from 'element-ui'

// 创建一个axios的实例
const service = axios.create({
  // 设置axios请求的基础地址
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000 // 定义5秒超时
})
// 请求拦截器
service.interceptors.request.use(config => { // 这里的config是请求对象，包含url、method和参数等
  if (store.getters.token) {
    if (IsCheckTimeOut()) {
      // user/logout 方法没有跳转登录页面的操作
      store.dispatch('user/logout')
      // 因此需要添加强制跳转登录页面的操作
      router.push({
        path: '/login'
      })
      return Promise.reject(new Error('token超时，请重新登录'))
    }
    // 在请求拦截器中给每个请求添加请求头
    config.headers['Authorization'] = `Bearer ${store.getters.token}`
  }
  // 这里返回的是一个全新的 请求对象config 用于再次发起请求
  // 必须要返回 config ，否则请求不能完成
  return config
}, error => {
  return Promise.reject(error)
})

// 响应拦截器
service.interceptors.response.use(response => {
  const { success, message, data } = response.data
  if (success) {
    // 成功后将服务器数据返回给用户
    return data
  } else {
    Message({
      showClose: true,
      message: message,
      type: 'error'
    })
    // 报错后直接进入catch,因为没有错误对象，所以要new一个错误对象
    return Promise.reject(new Error(message))
  }
}, error => {
  // 判断后端响应回来的数据中是否有代表token过期的错误码 10002
  if (error.response && error.response.data && error.response.data.code === 10002) {
    store.dispatch('user/logout')
    router.push({
      path: '/login'
    })
  } else {
    Message.error(error.message)
  }
  Message({
    showClose: true,
    message: error.message, // 提示错误信息
    type: 'error'
  })
  // 报错后直接进入catch
  return Promise.reject(error.message)
})

function IsCheckTimeOut() {
  var currentTime = Date.now()
  var timeStamp = getTimeStamp()
  return (currentTime - timeStamp) / 1000 > TimeOut // 返回一个布尔值
}

export default service // 导出axios实例
