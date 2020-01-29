import request from '@/utils/request'


export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function get_user_info(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function get_transact_order(token) {
  return request({
    url: '/user/get_transact_order',
    method: 'get',
    params: { token }
  })
}

export function read_message(token, data) {
  return request({
    url: '/user/read_message?token=' + token,
    method: 'post',
    data: data
  })
}

export function logout(token) {
  return request({
    url: '/user/logout?token=' + token,
    method: 'post'
  })
}
