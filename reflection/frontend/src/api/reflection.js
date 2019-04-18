import request from '../utils/request'

export function getReflectionList (params) {
  return request('reflection', {
    method: 'get',
    body: params
  })
}

export function createReflection (params) {
  return request('reflection', {
    method: 'post',
    body: params
  })
}