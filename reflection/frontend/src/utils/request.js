import qs from 'qs'
import message from "antd/lib/message"
export const baseURL = 'http://43fb4816464a4c47bdb3727d5b2c9491-cn-shenzhen.alicloudapi.com/'

const codeMessage = {
  200: '成功',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作',
  401: '令牌失效',
  403: '账号或密码错误',
  404: '无法连接',
  500: '服务器发生错误',
}

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response
  }
  const errortext = codeMessage[response.status] || response.statusText
  const error = new Error(errortext)
  error.name = response.status
  error.response = response
  throw error
}

/**
 * Request a URL, returning a promise.
 * @param url url
 * @param options options
 */
export default async function request (url, options) {
  // 拼接url
  let newUrl = url
  if (!/^https?:\/\//.test(url)) {
    newUrl = `${baseURL}${url}`
  }

  const newOptions = { ...options }
  if (newOptions.method === 'post' ||
    newOptions.method === 'put' ||
    newOptions.method === 'delete') {
    if (!(newOptions.body instanceof FormData)) {
      newOptions.headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        ...newOptions.headers,
      }
      newOptions.body = JSON.stringify(newOptions.body)
    } else {
      // newOptions.body is FormData
      newOptions.headers = {
        'Accept': 'application/json',
        ...newOptions.headers
      }
    }
  } else {
    const query = qs.stringify(newOptions.body, { indices: false })
    if (query.length) {
      newUrl = `${newUrl}?${query}`
    }
    delete newOptions.body
  }

  try {
    newOptions.headers = {
      ...newOptions.headers
    }
  } catch (err) {
    // console.log(err)
  }

  return fetch(newUrl, newOptions)
    .then(checkStatus)
    .then(response => response.json())
    .catch(err => {
      const status = err.name
      switch (status) {
        case 401:
          console.log('401')
          break
        case 403:
          console.log('账号或密码错误')
          break
        default:
          message.error(err.response.statusText)
          break
      }
      return Promise.reject(err)
    })
}