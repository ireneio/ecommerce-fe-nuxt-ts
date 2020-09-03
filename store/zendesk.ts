import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { $axios } from '~/utils/api'
import { ProxyRequestObject, ResponseObject } from 'Http'

@Module({
  name: 'zendesk',
  stateFactory: true,
  namespaced: true
})
export default class ZendeskModule extends VuexModule {
  public zendeskJwt: string = ''

  @Mutation
  setZendeskJwt(payload: string) {
    this.zendeskJwt = payload
  }

  @Action({ commit: 'setZendeskJwt' })
  async getZendeskJwt({ token, userToken: user_token }: any) {
    const requestBody: ProxyRequestObject = {
      // endpoint: '/api/Zendesk/GetJwt',
      endpoint: '/Zendesk/GetJwt',
      key: process.env.apiKey,
      data: {
        user_token
      },
      method: 'get',
      token
    }

    const result: ResponseObject = await $axios.post('/api', requestBody)
    console.log('result ', result)
    switch (result.data.syscode) {
      case 200:
        return result.data.data
      default:
        return null
    }
  }
}
