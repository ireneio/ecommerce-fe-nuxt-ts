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
  async getZendeskJwt({ token }: any) {
    const requestBody: ProxyRequestObject = {
      endpoint: '/api/Zendesk/Get',
      key: process.env.apiKey,
      method: 'get',
      token
    }
    try {
      const result: ResponseObject = await $axios.post('/api', requestBody)
      switch (result.data.syscode) {
        case 200:
          return result.data.data
        default:
          throw new Error('Cannot Get Jwt')
      }
    } catch (e) {
      throw new Error(e)
    }
  }
}
