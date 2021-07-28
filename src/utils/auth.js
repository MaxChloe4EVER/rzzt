// 引入 Cookies
import Cookies from 'js-cookie'

const TokenKey = 'hrsaas-ihrm-token'

// 读取 token
export function getToken() {
  return Cookies.get(TokenKey)
}

// 存储 token
export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

// 删除 token
export function removeToken() {
  return Cookies.remove(TokenKey)
}

// token超时处理-客户端主动介入
const timeKey = 'hrsaas-timestamp-key'

// 获取存入cookies的时间戳
export function getTimeStamp() {
  return Cookies.get(timeKey)
}

// 将当前事件存入cookies
export function setTimeStamp() {
  return Cookies.set(timeKey, Date.now())
}
