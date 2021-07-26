// 导出一个axios的实例  而且这个实例要有请求拦截器 响应拦截器
import axios from 'axios'

// 单独引入elementUI中的 Message 提醒
import { Message } from 'element-ui'

// 创建一个axios的实例
const service = axios.create({
  // 设置axios请求的基础地址
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000 // 定义5秒超时
})
// 请求拦截器
service.interceptors.request.use()

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
  Message({
    showClose: true,
    message: error.message, // 提示错误信息
    type: 'error'
  })
  // 报错后直接进入catch
  return Promise.reject(error.message)
})

export default service // 导出axios实例
