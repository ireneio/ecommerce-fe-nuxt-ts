declare module 'Http' {
  export interface ProxyRequestObject {
    endpoint: string
    data?: any
    key?: string
    method: string
    token?: string | undefined | null
  }
  export interface ResponseObject {
    syscode: number
    data: any
    sysmsg?: string
  }
}
