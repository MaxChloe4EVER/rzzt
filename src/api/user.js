// 引入 axions 实例对象
import request from '@/utils/request'

export function login(data) {
  // 必须要return 请求对象
  return request({
    url: '/sys/login',
    method: 'POST',
    data
  })
}

// 获取用户基本资料
export function getUserInfo() {
  return request({
    url: '/sys/profile',
    method: 'POST'
  })
}

// 获取用户详细信息
export function getUserDetailById(id) {
  return request({
    url: `/sys/user/${id}`
  })
}

export function getInfo(token) {

}

export function logout() {

}
