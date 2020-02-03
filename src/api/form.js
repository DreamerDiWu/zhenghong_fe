import request from '@/utils/request'
// prefix: http://localhost:8889
export function create_project(token, form) {
  return request({
    url: '/form/create_project?token=' + token, 
    method: 'post',
    data: form 
  })
}

// 'project_id', 'content', 'create_time'
export function create_project_log(token, form) {
  return request({
    url: '/form/create_project_log?token=' + token, 
    method: 'post',
    data: form 
  })
}


export function get_user_project_info(token) {
  return request({
    url: '/form/get_user_project_info?token='+ token,
    method: 'get'
  })
}

export function get_project_info(params) {
  return request({
    url: '/form/get_project_info?body='+ JSON.stringify(params),
    method: 'get'
  })
}

export function get_auth_project_info(token) {
  return request({
    url: '/form/get_auth_project_info?token='+ token,
    method: 'get'
  })
}