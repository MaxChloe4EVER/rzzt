// 引入操作 Cookies 的方法
import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth.js'
// 引入登录接口
import { login, getUserInfo, getUserDetailById } from '@/api/user'
// 设置 state 存储全局数据
const state = {
  // 设置token
  token: getToken(), // 每次初始化优先从缓存中读取
  // 设置共享用户信息
  userInfo: {}
}

const mutations = {
  // 这个 setToken 是更新 state 中的token
  setToken(state, token) {
    state.token = token
    setToken(token) // 这个 setToken 是将 token 存到 Cookies 中
  },
  removeToken(state) {
    // 将 vuex 中存储的 token 设置为 null
    state.token = null
    removeToken() // 删除 Cookies 中存储的 token
  },

  // 设置用户信息
  setUserInfo(state, userInfo) {
    // 什么情况下不会触发响应式
    // 1、直接通过数组索引修改元素内容
    // 2、给对象追加新的属性并赋值
    // this.$set(数组/对象，数组索引/对象字段，具体的值)， 可以通过这种方法进行修改，就能够触发响应式了
    // 如：修改数组 this.$set(list, 0, 666)
    // 修改对象 this.$set(person, 'password', 666)
    // 除以上两种情况外，其他都能触发响应式
    state.userInfo = { ...userInfo } // 将一个新对象重新赋值给 state.userInfo 也是会触发响应式的
  },

  // 删除用户信息
  removeUserInfo(state) {
    state.userInfo = {} // 重新设置为空对象
  }
}

const actions = {
  // 登录操作
  async login(context, data) {
    // 调用登录的接口，发起请求
    const result = await login(data)
    // 调用 mutations 中的 setToken 方法，将新用户的 token 传给 state，实现响应式
    context.commit('setToken', result)
    setTimeStamp()
  },
  // 获取用户信息
  async getUserInfo(context) {
    // 这里的 result 是被响应拦截器处理后的数据
    const result = await getUserInfo()
    const baseInfo = await getUserDetailById(result.userId)
    const obj = { ...result, ...baseInfo }
    // 调用 mutations 中的方法将用户信息传给 state 并保存起来
    context.commit('setUserInfo', obj)
  },
  logout(context) {
    // 坚持一个原则，用户登出清空state中的所有数据，就不会有太大的问题
    // 清除 state 里的token
    context.commit('removeToken')
    // 清除 state 里的userInfo
    context.commit('removeUserInfo')
  }
}

// 暴露一个配置对象
export default {
  // 打开命名控件
  namespaced: true,

  // 设置相关的 vuex 根节点
  state,
  mutations,
  actions
}

