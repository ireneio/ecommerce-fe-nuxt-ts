import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { $axios } from '~/utils/api'
import { ProxyRequestObject, ResponseObject } from 'Http'

@Module({
  name: 'funevents',
  stateFactory: true,
  namespaced: true
})
export default class FunEventsModule extends VuexModule {
  public eventList: any = []
  public eventDetail: any = []
  public calendar: any = []

  @Mutation
  setEventList(payload: any) {
    this.eventList = payload
  }

  @Mutation
  setEventDetail(payload: any) {
    this.eventDetail = payload
  }

  @Mutation
  setCalendar(payload: any) {
    this.calendar = payload
  }

  @Action({ commit: 'setEventList' })
  async getEventList({ token }: any) {
    const requestBody: ProxyRequestObject = {
      endpoint: '/api/FunActivity/GetFunActivityList',
      key: process.env.apiKey,
      method: 'get',
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

  @Action({ commit: 'setEventDetail' })
  async getEventDetail({ token, serialno }: any) {
    const requestBody: ProxyRequestObject = {
      endpoint: '/api/FunActivity/GetFunActivityEventsDetail',
      key: process.env.apiKey,
      data: { SerialNo: serialno },
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

  @Action({ commit: 'setCalendar' })
  async getCalendar({ token, date, calendarType }: any) {
    const requestBody: ProxyRequestObject = {
      endpoint: `/api/FunActivity/GetCalendar?date=${date}&calendarType=${calendarType}`,
      key: process.env.apiKey,
      method: 'get',
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
