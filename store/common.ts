import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { $axios } from '~/utils/api'
import { ProxyRequestObject, ResponseObject } from 'Http'

@Module({
  name: 'common',
  stateFactory: true,
  namespaced: true
})
export default class CommonModule extends VuexModule {
  public areaList: any = []
  public countyList: any = []
  public areas: any = []
  public categories: any = []

  @Mutation
  setAreaList(payload: any) {
    this.areaList = payload
  }

  @Mutation
  setCountyList({ data, index }: any) {
    let arr = [...this.countyList, [...data, index]]
    arr.sort((a, b) => a.index - b.index)
    this.countyList = [...arr]
  }

  @Mutation
  setCategories(payload: any) {
    this.categories = payload
  }

  @Mutation
  setAreas(payload: any) {
    this.areas = payload
  }

  @Action({ commit: 'setAreaList' })
  async getArea({ token }: any) {
    const requestBody: ProxyRequestObject = {
      endpoint: '/api/Main/FindFullNameAreas',
      key: process.env.apiKey,
      method: 'get',
      token
    }
    try {
      const result: ResponseObject = await $axios.post('/api', requestBody)
      switch (Number(result.data.syscode)) {
        case 200:
          return result.data.data
        case 404:
          return new Error('Failed to Get List')
        default:
          return new Error('Error rating the store')
      }
    } catch (e) {
      throw new Error(`Backend Error: ${e}`)
    }
  }

  @Action({ commit: 'setCountyList' })
  async getCounty({ token, areaName, index }: any) {
    const requestBody: ProxyRequestObject = {
      endpoint: '/api/Main/FindTowns',
      key: process.env.apiKey,
      data: { countyName: areaName },
      method: 'post',
      token
    }
    try {
      const result: ResponseObject = await $axios.post('/api', requestBody)
      switch (Number(result.data.syscode)) {
        case 200:
          return { data: result.data.data, index }
        case 404:
          return new Error('Failed to Get List')
        default:
          return new Error('Error rating the store')
      }
    } catch (e) {
      throw new Error(`Backend Error: ${e}`)
    }
  }

  @Action({ commit: 'setCategories' })
  async getCategories({ token }: any) {
    const requestBody: ProxyRequestObject = {
      endpoint: '/api/Main/FindCategories',
      key: process.env.apiKey,
      method: 'get',
      token
    }
    try {
      const result: ResponseObject = await $axios.post('/api', requestBody)
      switch (Number(result.data.syscode)) {
        case 200:
          return result.data.data
        case 404:
          return new Error('Failed to Get List')
        default:
          return null
      }
    } catch (e) {
      throw new Error(`Backend Error: ${e}`)
    }
  }

  @Action({ commit: 'setAreas' })
  async getAreas({ token }: any) {
    const requestBody: ProxyRequestObject = {
      endpoint: '/api/Main/FindAreas',
      key: process.env.apiKey,
      method: 'get',
      token
    }
    try {
      const result: ResponseObject = await $axios.post('/api', requestBody)
      switch (Number(result.data.syscode)) {
        case 200:
          return result.data.data
        case 404:
          return new Error('Failed to Get List')
        default:
          return null
      }
    } catch (e) {
      throw new Error(`Backend Error: ${e}`)
    }
  }
}
