declare module 'SignIn' {
  export interface SignInForm {
    username: string
    password: string
    isRemember: boolean
    isCheckPrivacy?: boolean
    privacyVersionName?: string
    accountToken?: string
  }
  export interface User {
    clientserialno: string
    accountid: string
    username: string
    email: string
    birth: string
    nickname: string
    gender: number
    photopath: string
    address: string
    phonenumber: string
    mobilephonenumber: string
    mobileVerifyStatus: number
    memberLevel: number
    isfirstlogin: boolean
    accountAttribute: number
    mainGroup: string
    groups: Array<any>
    isPasswordExpired: boolean
    dialcode?: string
  }
}
