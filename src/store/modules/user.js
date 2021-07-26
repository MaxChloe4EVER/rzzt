// 引入操作 Cookies 的方法
import { getToken, setToken, removeToken } from '@/utils/auth.js'
// 引入登录接口
import { login } from '@/api/user'
// 设置 state 存储全局数据
const state = {
  // 设置token
  token: getToken() || null // 每次初始化优先从缓存中读取
}

const mutations = {
  // 这个 setToken 是更新 state 中的token
  setToken(state, token) {
    state.token = token
    setToken(token) // 这个 setToken 是将 token 存到 Cookies 中
  },
  removeToken(state) {
    state.token = null
    removeToken() // 删除 Cookies 中存储的 token
  }
}

const actions = {
  async login(context, data) {
    // 调用登录的接口，发起请求
    const result = await login(data)
    // 调用 mutations 中的 setToken 方法，将新用户的 token 传给 state，实现响应式
    context.commit('setToken', result)
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

