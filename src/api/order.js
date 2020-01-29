import request from '@/utils/request'


export function propose_order(token, data) {
  return request({
    url: '/order/propose?token=' + token,
    method: 'post',
    data: data 
  })
}

export function transact_order(token, data) {
    return request({
      url: '/order/transact?token=' + token,
      method: 'post',
      data: data 
    })
}

export function get_transact_order(token) {
    return request({
      url: '/order/get_transact?token=' + token,
      method: 'get',
    })
}