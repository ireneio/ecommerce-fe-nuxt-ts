import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { $axios } from '~/utils/api'
import { ProxyRequestObject, ResponseObject } from 'Http'

@Module({
  name: 'welfare',
  stateFactory: true,
  namespaced: true
})
export default class WelfareModule extends VuexModule {
  public sheets: Array<any> = []
  public form: any = {}
  public authorized: boolean = false
  public latest: any = {}
  public formNew: any = {}
  public appliedList: any = {}

  get formInfo() {
    return this.form.info
      ? this.form.info
      : { sheetName: '', documentNumber: '', description: '' }
  }

  get formCols() {
    return this.form.columns ? this.form.columns : []
  }

  get formFilledCols() {
    if (
      Object.keys(this.formNew).length &&
      Object.keys(this.formNew.columns).length
    ) {
      const res = { ...this.formNew.columns }
      Object.keys(this.formNew.columns).forEach((key) => {
        if (res[key] === 'true') {
          res[key] = true
        }
        if (res[key] === 'false') {
          res[key] = false
        }
        if (key === 'RelationshipWithDeceased') {
          res[key] = Number(this.formNew.columns[key])
        }
      })
      return res
    } else {
      return {}
    }
  }

  get latestUpdatedDateTime() {
    return Object.keys(this.formNew).length
      ? new Date(this.formNew.latestUpdateDateTime).toLocaleString()
      : ''
  }

  get userName() {
    return Object.keys(this.formNew).length ? this.formNew.applicantName : ''
  }

  get userId() {
    return Object.keys(this.formNew).length ? this.formNew.creatorId : ''
  }

  get appliedListData() {
    return this.appliedList.data
  }

  get appliedListDataLength() {
    return this.appliedList.recordsTotal
  }

  @Mutation
  setSheets(payload: any) {
    this.sheets = payload
  }

  @Mutation
  setForm(payload: any) {
    this.form = payload
  }

  @Mutation
  setFormNew(payload: any) {
    this.formNew = payload
  }

  @Mutation
  setAuthorized(payload: boolean) {
    this.authorized = payload
  }

  @Mutation
  setLatest(payload: any) {
    // this.latest = payload
    this.formNew = payload
  }

  @Mutation
  setAppliedList(payload: any) {
    this.appliedList = payload
  }

  @Action({ commit: 'setSheets' })
  async getSheets({ token }: any) {
    const requestBody: ProxyRequestObject = {
      endpoint: '/api/welfare/apply/sheets',
      key: process.env.apiKey,
      method: 'get',
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

  @Action({ commit: 'setFormNew' })
  async getForm({ serialno, token }: any) {
    const requestBody: ProxyRequestObject = {
      endpoint: '/api/welfare/apply/new',
      key: process.env.apiKey,
      data: { Id: serialno },
      method: 'post',
      token
    }

    const result: ResponseObject = await $axios.post('/api', requestBody)
    switch (result.data.syscode) {
      case 200:
        return result.data.data
      case 4037:
        throw new Error('Not Found')
      case 500:
        throw new Error('Server Error')
      default:
        return null
    }
  }

  @Action({ commit: 'setAuthorized' })
  async getAuthorized({ token }: any) {
    const requestBody: ProxyRequestObject = {
      endpoint: '/api/welfare/permission/authorize',
      key: process.env.apiKey,
      method: 'get',
      token
    }

    const result: ResponseObject = await $axios.post('/api', requestBody)
    switch (result.data.syscode) {
      case 200:
        return true
      case 403:
      case 400:
      case 401:
        return false
      case 500:
        throw new Error('Server Error')
      default:
        return null
    }
  }

  @Action({ commit: 'setForm' })
  async getFormData({ serialno, token }: any) {
    const requestBody: ProxyRequestObject = {
      endpoint: `/api/welfare/sheets/${serialno}`,
      key: process.env.apiKey,
      method: 'get',
      token
    }

    const result: ResponseObject = await $axios.post('/api', requestBody)
    switch (result.data.syscode) {
      case 200:
        return result.data.data
      case 400:
      case 403:
      case 404:
      case 4037:
        throw new Error('Not Found')
      case 500:
        throw new Error('Server Error')
      default:
        return null
    }
  }

  @Action({ commit: 'setLatest' })
  async getLatest({ serialno, token }: any) {
    const requestBody: ProxyRequestObject = {
      endpoint: `/api/welfare/applicationForm/get?id=${serialno}`,
      key: process.env.apiKey,
      method: 'get',
      token
    }

    const result: ResponseObject = await $axios.post('/api', requestBody)
    switch (result.data.syscode) {
      case 200:
        return result.data.data
      case 400:
      case 403:
      case 404:
      case 4037:
        throw new Error('Not Found')
      case 500:
        throw new Error('Server Error')
      default:
        return null
    }
  }

  @Action({ commit: 'setAppliedList' })
  async getAppliedList({
    token,
    start,
    length,
    ApplicationStartDate,
    SearchText,
    SearchStatus
  }: any) {
    const requestBody: ProxyRequestObject = {
      endpoint: '/api/welfare/applicationForm/getAppliedList',
      key: process.env.apiKey,
      data: {
        start,
        length,
        ApplicationStartDate,
        SearchText,
        SearchStatus
      },
      method: 'post',
      token
    }

    const result: ResponseObject = await $axios.post('/api', requestBody)
    switch (result.data.syscode) {
      case 200:
        return result.data
      case 400:
      case 403:
      case 404:
      case 4037:
        throw new Error('Not Found')
      case 500:
        throw new Error('Server Error')
      default:
        return null
    }
  }
}
