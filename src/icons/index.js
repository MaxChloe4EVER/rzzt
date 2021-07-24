import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon'// svg component

// register globally
// 注册全局的 svg-icon 组件
Vue.component('svg-icon', SvgIcon)

// 读取 svg目录下 所有后缀为 .svg 的文件
const req = require.context('./svg', false, /\.svg$/)

// 将读取到的 svg 文件全部引入到项目中
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)
