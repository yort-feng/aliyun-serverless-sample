import request from '../utils/request'

export function getReflectionList (params) {
  return request('reflections', {
    method: 'get',
    body: params
  })
}

export function createReflection (params) {
  return request('reflections', {
    method: 'post',
    body: params
  })
}