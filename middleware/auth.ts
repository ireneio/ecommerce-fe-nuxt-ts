import { $axios } from '~/utils/api'
import { ProxyRequestObject, ResponseObject } from 'Http'

export default async function ({ app, store, redirect, route }: any) {
  if (route.name === '/account') {
    const authStatus = store.state.auth.isLoggedIn
    if (!authStatus) {
      redirect('/account')
    }
  }

  const token = app.$cookies.get('accessToken')
  if (token) {
    const requestBody: ProxyRequestObject = {
      endpoint: '/api/Accounts/@me',
      key: process.env.apiKey,
      token,
      method: 'get'
    }
    try {
      const result: ResponseObject = await $axios.post('/api', requestBody)
      if (result.data.syscode !== 200) {
        redirect('/account')
      } else {
        store.commit('auth/setUser', result.data.data)
        const { isfirstlogin } = result.data.data

        if (isfirstlogin) {
          redirect('/account/register')
        } else if (route.name === 'account') {
          redirect('/')
        } else if (route.name === 'account-forgetPassword') {
          redirect('/account')
        }
      }
    } catch (e) {
      // throw new Error('Auth Error')
      redirect('/account')
    }
  } else {
    redirect('/account')
  }
}
