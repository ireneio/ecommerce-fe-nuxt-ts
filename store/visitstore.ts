import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { $axios } from '~/utils/api'
import { ProxyRequestObject, ResponseObject } from 'Http'

@Module({
  name: 'visitstore',
  stateFactory: true,
  namespaced: true
})
export default class VisitStoreModule extends VuexModule {
  public storeHome: any = []
  public searchParams: any = {
    categoryId: 0,
    areaId: 0,
    groupType: 0,
    sort: 5,
    keyWord: ''
  }

  public storeDetail: any = {}

  public couponDetail: any = {}

  @Mutation
  setStoreHome(payload: any) {
    this.storeHome = payload
  }

  @Mutation
  setStoreDetail(payload: any) {
    this.storeDetail = payload
  }

  @Mutation
  setCouponDetail(payload: any) {
    this.couponDetail = payload
  }

  @Mutation
  setSearchParams({ params, value }: any) {
    this.searchParams = { ...this.searchParams, [params]: value }
  }

  @Action({ commit: 'setStoreHome' })
  async getStoreHome({ token, sectionType }: any) {
    const requestBody: ProxyRequestObject = {
      endpoint: '/api/Store/Search',
      key: process.env.apiKey,
      data: { ...this.searchParams, sectionType, size: 999999999 },
      method: 'post',
      token
    }
    if (sectionType === 1) {
      delete requestBody.data.groupType
    }
    try {
      const result: ResponseObject = await $axios.post('/api', requestBody)
      switch (Number(result.data.syscode)) {
        case 200:
          return result.data.data
        default:
          return new Error('Error fetching Store Info')
      }
    } catch (e) {
      throw new Error(`Backend Error: ${e}`)
    }
  }

  @Action({ commit: 'setStoreDetail' })
  async getStoreDetail({ token, serialno }: any) {
    const requestBody: ProxyRequestObject = {
      endpoint: '/api/Store/GetStoreInfo',
      key: process.env.apiKey,
      data: { storeId: serialno },
      method: 'post',
      token
    }
    try {
      const result: ResponseObject = await $axios.post('/api', requestBody)
      switch (Number(result.data.syscode)) {
        case 200:
          return result.data.data
        default:
          return new Error('Error fetching Store Info')
      }
    } catch (e) {
      throw new Error(`Backend Error: ${e}`)
    }
  }

  @Action({ commit: 'setCouponDetail' })
  async getCouponDetail({ token, serialno }: any) {
    const requestBody: ProxyRequestObject = {
      endpoint: '/api/Store/GetCouponInfo',
      key: process.env.apiKey,
      data: { couponId: serialno },
      method: 'post',
      token
    }
    try {
      const result: ResponseObject = await $axios.post('/api', requestBody)
      switch (Number(result.data.syscode)) {
        case 200:
          return result.data.data
        default:
          return new Error('Error fetching Store Info')
      }
    } catch (e) {
      throw new Error(`Backend Error: ${e}`)
    }
  }
}
