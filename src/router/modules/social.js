// 引入 布局组件 layout
import layout from '@/layout'

// 暴露路由规则
export default {
  path: '/social',
  component: layout,
  children: [
    {
      path: '',
      component: () => import('@/views/social'),
      meta: {
        title: '社保',
        icon: 'table'
      }
    }
  ]
}
