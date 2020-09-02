import { NuxtAxiosInstance } from '@nuxtjs/axios'
import { NuxtCookies } from 'cookie-universal-nuxt'

let $axios: NuxtAxiosInstance

export function initializeAxios(axiosInstance: NuxtAxiosInstance) {
  $axios = axiosInstance
  const url =
    process.env.useProxy === '1' ? process.env.proxyUrl : process.env.apiUrl

  const api = $axios.create({
    headers: {
      common: {
        Accept: 'text/plain, */*'
      }
    },
    baseURL: url,
    timeout: 20000
  })

  return api
}

let $cookies: NuxtCookies

export function initializeCookies(cookiesInstance: NuxtCookies) {
  $cookies = cookiesInstance
}

export { $axios, $cookies }
