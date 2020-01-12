import request from '@/utils/request'


export function login(data) {
  return request({
    url: 'http://localhost:8889/user/login',
    method: 'post',
    data
  })
}

export function get_user_info(token) {
  return request({
    url: 'http://localhost:8889/user/info',
    method: 'get',
    params: { token }
  })
}

export function get_transact_order(token) {
  return request({
    url: 'http://localhost:8889/user/get_transact_order',
    method: 'get',
    params: { token }
  })
}

export function read_message(token, data) {
  return request({
    url: 'http://localhost:8889/user/read_message?token=' + token,
    method: 'post',
    data: data
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
