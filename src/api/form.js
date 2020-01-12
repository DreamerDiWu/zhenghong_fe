import request from '@/utils/request'

export function create_project(token, form) {
  console.log("form=", form)
  return request({
    url: 'http://localhost:8889/form/create_project?token=' + token, 
    method: 'post',
    data: form 
  })
}

// 'project_id', 'content', 'create_time'
export function create_project_log(token, form) {
  console.log(form)
  return request({
    url: 'http://localhost:8889/form/create_project_log?token=' + token, 
    method: 'post',
    data: form 
  })
}


export function get_user_project_info(token) {
  return request({
    url: 'http://localhost:8889/form/get_user_project_info?token='+ token,
    method: 'get'
  })
}

export function get_project_info(params) {
  return request({
    url: 'http://localhost:8889/form/get_project_info?body='+ JSON.stringify(params),
    method: 'get'
  })
}

export function get_all_project_info(token) {
  return request({
    url: 'http://localhost:8889/form/get_all_project_info?token='+ token,
    method: 'get'
  })
}