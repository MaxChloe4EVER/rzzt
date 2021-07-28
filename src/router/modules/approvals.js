// 引入 布局组件 layout
import layout from '@/layout'

// 暴露 employee 路由规则
export default {
  path: '/approvals',
  name: 'approvals',
  // 点击跳转到 /employee 路由时，实际上显示的是layout这个一级路由，但由于layout的children设置了一个默认的 employee 子路由，所以默认的子路由也跟着显示出来了
  component: layout,
  children: [
    {
      path: '',
      component: () => import('@/views/approvals'),
      meta: {
        title: '审批管理',
        icon: 'tree-table'
      }
    }
  ]
}
