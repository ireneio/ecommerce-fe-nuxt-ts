import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { $axios } from '~/utils/api'
import { ProxyRequestObject, ResponseObject } from 'Http'

@Module({
  name: 'gift',
  stateFactory: true,
  namespaced: true
})
export default class GiftModule extends VuexModule {
  public notTakenOut: any = []

  @Mutation
  setNotTakenOut(payload: any) {
    this.notTakenOut = payload
  }

  @Action({ commit: 'setNotTakenOut' })
  async getNotTakenOut({ token }: any) {
    const requestBody: ProxyRequestObject = {
      endpoint: '/api/giftActivity/notTakenOuts',
      key: process.env.apiKey,
      method: 'get',
      token
    }
    try {
      const result: ResponseObject = await $axios.post('/api', requestBody)
      switch (Number(result.data.syscode)) {
        case 200:
          return result.data.data
        case 204:
          // no unopened Gifts
          return result.data.data
        case 404:
          throw new Error('Failed to Get List')
        default:
          return null
      }
    } catch (e) {
      throw new Error(`Backend Error: ${e}`)
    }
  }

  // @Action({ commit: 'setNotTakenOut' })
  // async getGiftAvailable({ token }: any) {
  //   const requestBody: ProxyRequestObject = {
  //     endpoint: '/api/giftActivity/notTakenOuts',
  //     key: process.env.apiKey,
  //     method: 'get',
  //     token
  //   }
  //   try {
  //     const result: ResponseObject = await $axios.post('/api', requestBody)
  //     switch (Number(result.data.syscode)) {
  //       case 200:
  //         return result.data.data
  //       case 204:
  //         // no unopened Gifts
  //         return result.data.data
  //       case 404:
  //         throw new Error('Failed to Get List')
  //       default:
  //         return null
  //     }
  //   } catch (e) {
  //     throw new Error(`Backend Error: ${e}`)
  //   }
  // }
}
