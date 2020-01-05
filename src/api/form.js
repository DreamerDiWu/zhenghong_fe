import request from '@/utils/request'

export function create(form) {
  console.log(form)
  return request({
    url: 'http://localhost:8889/form/new',
    method: 'post',
    data: form 
  })
}

export function update(token, form) {
    return request({
      url: 'http://localhost:8889/form/update?token=' + token,
      method: 'post',
      data: form
    })
}

export function pull(token) {
  return request({
    url: 'http://localhost:8889/form/pull?token='+ token,
    method: 'get'
  })
}

export function pull_detail(params) {
  return request({
    url: 'http://localhost:8889/form/pull_detail?body='+ JSON.stringify(params),
    method: 'get'
  })
}