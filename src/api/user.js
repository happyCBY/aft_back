import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/back/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

//  登录
export function handleLoginIn(data) {
  return request({
    url: '/api/back/login',
    method: 'post',
    data
  })
}
