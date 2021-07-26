// 引入 axions 实例对象
import request from '@/utils/request'

export function login(data) {
  request({
    url: '/sys/login',
    method: 'POST',
    data
  })
}

export function getInfo(token) {

}

export function logout() {

}
