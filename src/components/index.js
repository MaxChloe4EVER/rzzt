import PageTools from '@/components/PageTools'
import UploadExcel from '@/components/UploadExcel'

export default {
  install(Vue) {
    // 注册工具栏组件
    Vue.component('PageTools', PageTools)
    // 注册导入excel组件
    Vue.component('UploadExcel', UploadExcel)
  }
}
