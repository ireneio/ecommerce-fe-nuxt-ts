import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators'
import { $axios } from '~/utils/api'
import { SignInForm, User } from 'SignIn'
import { ProxyRequestObject, ResponseObject } from 'Http'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { commonStore } from '~/utils/store-accessor'

@Module({
  name: 'auth',
  stateFactory: true,
  namespaced: true
})
export default class AuthModule extends VuexModule {
  public user: User | null = {
    clientserialno: '',
    accountid: '',
    username: '',
    email: '',
    birth: '',
    nickname: '',
    gender: 0,
    photopath: '',
    address: '',
    phonenumber: '',
    mobilephonenumber: '',
    mobileVerifyStatus: 0,
    memberLevel: 0,
    isfirstlogin: false,
    accountAttribute: 0,
    mainGroup: '',
    groups: [],
    isPasswordExpired: false
  }
  public isLoggedIn: boolean = false
  public menu: any = []
  public countryCode: any = []
  public accountHint: any = {}
  public privacyContent: any = {}
  public showPrivacy: boolean = false
  public accountToken: string = ''
  public tempUserInfo: any = {}

  get privacyHtml() {
    return this.privacyContent.content
  }

  get privacyVersionName() {
    return this.privacyContent.versionName
  }

  get privacyVersionNumber() {
    return this.privacyContent.versionSerialNo
  }

  @Mutation
  setTempUserInfo(payload: any) {
    this.tempUserInfo = payload
  }

  @Mutation
  setAccountToken(payload: string) {
    this.accountToken = payload
  }

  @Mutation
  setShowPrivacy(payload: boolean) {
    this.showPrivacy = payload
  }

  @Mutation
  setUser(payload: any) {
    this.user = payload.ProfileInfo ? payload.ProfileInfo : payload
    this.isLoggedIn = true
  }

  @Mutation
  removeUser() {
    this.user = null
    this.isLoggedIn = false
  }

  @Mutation
  setMenu(payload: any) {
    this.menu = payload
  }

  @Mutation
  setCountryCode(payload: any) {
    this.countryCode = payload
  }

  @Mutation
  setAccountHint(payload: any) {
    this.accountHint = payload
  }

  @Mutation
  setPrivacyContent(payload: any) {
    this.privacyContent = payload
  }

  @Action({ commit: 'removeUser' })
  async signOut({ token }: any) {
    const requestBody: ProxyRequestObject = {
      endpoint: '/api/auth/SignOut',
      key: process.env.apiKey,
      method: 'post',
      token
    }

    const result: ResponseObject = await $axios.post('/api', requestBody)
    switch (result.data.syscode) {
      case 200:
        return true
      case 406:
        // Account Error
        return 406
      case 40102:
        // Password Error
        return 40102
      case 400:
        return 400
      default:
        return null
    }
  }

  @Action({ commit: 'setMenu' })
  async getMenu({ token }: any) {
    const requestBody: ProxyRequestObject = {
      endpoint: '/api/auth/getmenu',
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
          throw new Error('Error fetching')
      }
    } catch (e) {
      throw new Error(e)
    }
  }

  @Action({ commit: 'setUser' })
  async getAccessToken(payload: SignInForm) {
    const { username, password, isRemember } = payload
    const requestBody: ProxyRequestObject = {
      endpoint: '/api/auth/signin',
      data: {
        username,
        password,
        isRemember
      },
      key: process.env.apiKey,
      method: 'post'
    }
    if (payload.privacyVersionName) {
      requestBody.data.privacyVersionName = payload.privacyVersionName
    }
    try {
      const result: ResponseObject = await $axios.post('/auth', requestBody)
      switch (result.data.syscode) {
        case 200:
          return result.data.data
        case 406:
          // Account Error
          return 406
        case 40102:
          // Password Error
          return 40102
        case 4032:
          // Privacy Agreement Required
          return { status: 4032, data: result.data.data }
        case 400:
          return 400
        default:
          return 'Default Error'
      }
    } catch (e) {
      throw new Error(e)
    }
  }

  @Action({ commit: 'setCountryCode' })
  async getCountryCode() {
    const requestBody: ProxyRequestObject = {
      endpoint: '/api/auth/Country',
      key: process.env.apiKey,
      method: 'get'
    }

    const result: ResponseObject = await $axios.post('/auth', requestBody)
    switch (result.data.syscode) {
      case 200:
        return result.data.data
      case 406:
        // Account Error
        return 406
      case 40102:
        // Password Error
        return 40102
      case 400:
        return 400
      default:
        return null
    }
  }

  @Action({ commit: 'setAccountHint' })
  async getAccountHint({ dialcode, keyword }: any) {
    const requestBody: ProxyRequestObject = {
      endpoint: '/api/auth/accounthint',
      key: process.env.apiKey,
      data: { dialcode, keyword },
      method: 'post'
    }

    const result: ResponseObject = await $axios.post('/auth', requestBody)
    switch (result.data.syscode) {
      case 200:
        return result.data.data
      case 40402:
        // Account does not exist
        throw new Error('找不到您的手機號碼，有可能您尚未開通帳戶')
      default:
        return null
    }
  }

  @Action({ commit: 'setPrivacyContent' })
  async getPrivacyContent() {
    const requestBody: ProxyRequestObject = {
      endpoint: '/api/PrivacyContent',
      key: process.env.apiKey,
      method: 'get'
    }

    try {
      const result: ResponseObject = await $axios.post('/auth', requestBody)
      switch (Number(result.data.syscode)) {
        case 200:
          return result.data.data
        default:
          throw new Error('Error fetching')
      }
    } catch (e) {
      throw new Error(e)
    }
  }
}
