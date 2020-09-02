import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { $axios } from '~/utils/api'
import { ProxyRequestObject, ResponseObject } from 'Http'

@Module({
  name: 'announcements',
  stateFactory: true,
  namespaced: true
})
export default class AnnouncementsModule extends VuexModule {
  public ads: any = []
  public adDetail: any = {}

  @Mutation
  setAds(payload: any) {
    this.ads = payload
  }

  @Mutation
  setAdDetail(payload: any) {
    this.adDetail = payload
  }

  @Action({ commit: 'setAds' })
  async getAds({ token }: any) {
    const requestBody: ProxyRequestObject = {
      endpoint: '/api/Announcement/List',
      key: process.env.apiKey,
      data: {},
      method: 'post',
      token
    }

    const result: ResponseObject = await $axios.post('/api', requestBody)
    switch (result.data.syscode) {
      case 200:
        return result.data.data
      default:
        return null
    }
  }

  @Action({ commit: 'setAdDetail' })
  async getAdDetail({ serialno, token }: any) {
    const requestBody: ProxyRequestObject = {
      endpoint: '/api/Announcement/Detail',
      key: process.env.apiKey,
      data: { AnnouncementId: serialno },
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
