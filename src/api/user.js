import request from '@/utils/request'


export function login(data) {
  return request({
    url: 'http://localhost:8889/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: 'http://localhost:8889/user/info',
    method: 'get',
    params: { token }
  })
}


export function updateEvent(token, params) {
  console.log(params)
  return request({
    url: 'http://localhost:8889/user/update_event?token=' + token,
    method: 'post',
    data: params
  })
}

export function pullReview(token) {
  return request({
    url: 'http://localhost:8889/user/pull_review?token=' + token,
    method: 'get',
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
