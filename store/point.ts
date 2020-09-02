import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { $axios } from '~/utils/api'
import { ProxyRequestObject, ResponseObject } from 'Http'

@Module({
  name: 'point',
  stateFactory: true,
  namespaced: true
})
export default class PointModule extends VuexModule {
  public pointDiscount: any = []

  @Mutation
  setPointDiscount(payload: any) {
    this.pointDiscount = payload
  }

  @Action({ commit: 'setPointDiscount' })
  async getDiscountAmount({ amount, token }: any) {
    const requestBody: ProxyRequestObject = {
      endpoint: '/api/Point/Calculate',
      key: process.env.apiKey,
      data: { amount },
      method: 'post',
      token
    }

    const result: ResponseObject = await $axios.post('/api', requestBody)
    switch (result.data.syscode) {
      case 200:
        return result.data.data
      case 500:
        throw new Error('Server Error')
      default:
        return null
    }
  }
}
