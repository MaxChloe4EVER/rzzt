// 引入 布局组件 layout
import layout from '@/layout'

// 暴露 employee 路由规则
export default {
  path: '/employees',
  // 点击跳转到 /employee 路由时，实际上显示的是layout这个一级路由，但由于layout的children设置了一个默认的 employee 子路由，所以默认的子路由也跟着显示出来了
  component: layout,
  children: [
    {
      path: '', // 这里不需要写 path，不写就说明这个二级路由是一级路由的默认路由
      component: () => import('@/views/employees'),
      // 路由的其他信息
      meta: {
        title: '员工管理',
        icon: 'people'
      }
    },
    {
      path: 'detail/:id', // query传参 动态路由传参
      component: () => import('@/views/employees/detail'),
      hidden: true, // 不在左侧菜单显示
      meta: {
        title: '员工详情' // 标记当前路由规则的中文名称 后续在做左侧菜单时 使用
      }
    }
  ]
}
