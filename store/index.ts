import { Store } from 'vuex'
import axios from 'axios'
import { Context, NuxtAppOptions } from '@nuxt/types'
import { ProxyRequestObject, ResponseObject } from 'Http'
import { initialiseStores } from '~/utils/store-accessor'

const initializer = (store: Store<any>) => initialiseStores(store)

export const actions = {
  async nuxtServerInit({ commit }: NuxtAppOptions, { app, redirect }: Context) {
    console.log('Nuxt-Server-Init Initialized...')
    const token: string | undefined = app.$cookies.get('accessToken')

    if (token) {
      const requestBody: ProxyRequestObject = {
        endpoint: '/api/Accounts/@me',
        token,
        method: 'get'
      }
      try {
        const result: ResponseObject = await axios.post(
          `${process.env.NUXT_ENV_PROXY_URL}/api`,
          requestBody
        )
        if (Number(result.data.syscode) !== 200) {
          redirect('/account')
        } else {
          commit('auth/setUser', result.data.data)
        }
      } catch (e) {
        console.log('Nuxt-Server-Init Validation Error: ', e)
        redirect('/account')
      }
    } else {
      redirect('/account')
    }
  }
}

export const plugins = [initializer]
export * from '~/utils/store-accessor'
