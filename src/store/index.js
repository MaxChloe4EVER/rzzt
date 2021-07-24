import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'

Vue.use(Vuex)

// vuex 的模块化
const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user
  },
  // 建立访问 state mutation 等根节点的快速访问
  getters
})

export default store
