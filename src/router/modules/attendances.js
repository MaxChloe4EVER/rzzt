// 引入 布局组件 layout
import layout from '@/layout'

// 暴露路由规则
export default {
  path: '/attendances',
  component: layout,
  children: [
    {
      path: '',
      component: () => import('@/views/attendances'),
      meta: {
        title: '考勤',
        icon: 'skill'
      }
    }
  ]
}
