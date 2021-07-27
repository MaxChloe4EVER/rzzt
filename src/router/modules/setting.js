// 引入 布局组件 layout
import layout from '@/layout'

// 暴露路由规则
export default {
  path: '/setting',
  name: 'setting',
  component: layout,
  children: [
    {
      path: '',
      component: () => import('@/views/setting'),
      meta: {
        title: '公司设置'
      }
    }
  ]
}
