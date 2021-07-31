const getters = {
  // 建立 app 相关节点 的 快捷访问，这些都是getters监听的数据
  sidebar: state => state.app.sidebar, // 这后面是个箭头函数
  device: state => state.app.device,
  token: state => state.user.token, // 在根级的getters上 开发子模块的属性给别人看 给别人用
  name: state => state.user.userInfo.username, // 建立对于用户名的快捷访问
  userId: state => state.user.userInfo.userId, // 快捷访问用户ID
  staffPhoto: state => state.user.userInfo.staffPhoto, // 快捷访问用户头像
  companyId: state => state.user.userInfo.companyId // 快捷访问用户头像
}
export default getters
