// 引入 布局组件 layout
import layout from '@/layout'

// 暴露路由规则
export default {
  path: '/departments',
  component: layout,
  children: [
    {
      path: '',
      component: () => import('@/views/departments'),
      meta: {
        title: '组织架构',
        icon: 'tree'
      }
    }
  ]
}
