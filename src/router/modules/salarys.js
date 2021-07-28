// 引入 布局组件 layout
import layout from '@/layout'

// 暴露路由规则
export default {
  path: '/salarys',
  name: 'salarys',
  component: layout,
  children: [
    {
      path: '',
      component: () => import('@/views/salarys'),
      meta: {
        title: '工资',
        icon: 'money'
      }
    }
  ]
}
