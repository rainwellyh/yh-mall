import axios from './axios'

// 首页的网络请求，方便统一管理，待会发送到axios
export const BANNER = 'banner'
export const RECOMMEND = 'recommend'

export function getHomeMultidata() {
  return axios({//返回axios()函数返回Promise对象，之后可以使用then()接收
    url: '/home/multidata'
  })
}

export function getHomeData(type, page) {
  return axios({
    url: '/home/data',
    params: {
      type,
      page
    }
  })
}
