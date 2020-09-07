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
  public signingList: any = {}

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
      ? new Date(this.formNew.latestUpdateDateTime).toLocaleString('zh-tw', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          formatMatcher: 'basic'
        })
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

  get signingListData() {
    return this.signingList.data
  }

  get signingListDataLength() {
    return this.signingList.recordsTotal
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

  @Mutation
  public setSigningList(payload: any) {
    this.signingList = payload
  }

  @Action({ commit: 'setSheets' })
  public async getSheets({ token }: any) {
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
  public async getForm({ serialno, token }: any) {
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
  public async getAuthorized({ token }: any) {
    const requestBody: ProxyRequestObject = {
      endpoint: '/api/welfare/permission/authorize',
      key: process.env.apiKey,
      method: 'get',
      token
    }

    const result: ResponseObject = await $axios.post('/api', requestBody)
    switch (result.data.syscode) {
      case 200:
        return result.data.data
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
  public async getFormData({ serialno, token }: any) {
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
  public async getLatest({ serialno, token }: any) {
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
  public async getAppliedList({
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

  @Action({ commit: 'setSigningList' })
  public async getSigningList({
    token,
    start,
    length,
    ApplicationStartDate,
    ApplicationEndDate,
    SearchText,
    SearchStatus
  }: any) {
    const requestBody: ProxyRequestObject = {
      endpoint: '/api/Welfare/ApplicationForm/GetSigningList',
      data: {
        start,
        length,
        ApplicationStartDate,
        ApplicationEndDate,
        SearchText,
        SearchStatus
      },
      method: 'post',
      token
    }

    const result: ResponseObject = await $axios.post('/api', requestBody)
    switch (Number(result.data.syscode)) {
      case 200:
        return result.data
      case 400:
      case 403:
      case 404:
      case 417:
        throw new Error('Not Found')
      case 500:
        throw new Error('Server Error')
      default:
        return null
    }
  }
}
