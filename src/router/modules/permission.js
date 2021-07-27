// 引入 布局组件 layout
import layout from '@/layout'

// 暴露路由规则
export default {
  path: '/permission',
  name: 'permission',
  component: layout,
  children: [
    {
      path: '',
      component: () => import('@/views/permission'),
      meta: {
        title: '权限管理'
      }
    }
  ]
}
