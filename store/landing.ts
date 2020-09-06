import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators'
import { $axios } from '~/utils/api'
import { ProxyRequestObject, ResponseObject } from 'Http'

@Module({
  name: 'landing',
  stateFactory: true,
  namespaced: true
})
export default class LandingModule extends VuexModule {
  public landing: any = {}

  get landingReordered() {
    const arr = [...Object.keys(this.landing)]
    if (arr.length) arr.sort((a: any, b: any) => a.order - b.order)
    return arr
  }
  get landingData() {
    const reformat = this.landingReordered.map((item: any) => ({
      data: this.landing[item].dataList,
      title: item
    }))
    const announcement: any = reformat.find(
      (item) => item.title === 'announcement'
    )
    const combineAnnouncement = reformat
      .filter((item) => item.title !== 'announcement')
      .map((item) => {
        if (item.title === 'announcementTag') {
          return { ...item, data: [announcement.data[0], ...item.data] }
        } else {
          return item
        }
      })

    return this.landingReordered.length ? combineAnnouncement : []
  }

  @Mutation
  setLanding(payload: any) {
    this.landing = payload
  }

  @Action({ commit: 'setLanding', rawError: true })
  async getLanding({ token }: any) {
    const requestBody: ProxyRequestObject = {
      endpoint: '/api/FunMall/GetAll',
      token,
      key: process.env.apiKey,
      method: 'get'
    }
    try {
      const result: ResponseObject = await $axios.post('/api', requestBody)
      switch (result.data.syscode) {
        case 200:
          return result.data.data
        case 500:
          throw new Error('Timeout')
        default:
          return null
      }
    } catch (e) {
      throw new Error(e)
    }
  }
}
