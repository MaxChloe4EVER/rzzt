const getters = {
  // 建立 app 相关节点 的 快捷访问
  sidebar: state => state.app.sidebar, // 这后面是个箭头函数
  device: state => state.app.device
}
export default getters
