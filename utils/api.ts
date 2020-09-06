import { NuxtAxiosInstance } from '@nuxtjs/axios'
import { NuxtCookies } from 'cookie-universal-nuxt'
import { AxiosInstance } from 'axios'

let $nuxtAxiosInstance: NuxtAxiosInstance
let $axios: AxiosInstance

export function initializeAxios(axiosInstance: NuxtAxiosInstance) {
  $nuxtAxiosInstance = axiosInstance
  $axios = $nuxtAxiosInstance.create({
    headers: {
      common: {
        Accept: 'text/plain, */*'
      }
    },
    baseURL: process.env.PROXY_URL,
    timeout: 20000
  })
}

let $cookies: NuxtCookies

export function initializeCookies(cookiesInstance: NuxtCookies) {
  $cookies = cookiesInstance
}

export { $axios, $cookies }
