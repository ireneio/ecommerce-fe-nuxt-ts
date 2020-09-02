import { Module, VuexModule, Mutation } from 'vuex-module-decorators'

interface Dialog {
  title?: string
  message?: string
  type?: string
  icon?: boolean
  initializer?: string
}
@Module({
  name: 'dialog',
  stateFactory: true,
  namespaced: true
})
export default class DialogModule extends VuexModule {
  public active: boolean = false
  public type: 'confirm' | 'accept' = 'accept'
  public confirmed: boolean = false
  public confirmAction: any = null
  public maskActive: boolean = false
  public content: Dialog = {
    title: '',
    message: '',
    type: '',
    icon: false,
    initializer: ''
  }

  @Mutation
  setMaskActive(payload: boolean) {
    this.maskActive = payload
  }
  @Mutation
  setActive(payload: boolean) {
    this.active = payload
  }
  @Mutation
  setType(payload: 'confirm' | 'accept') {
    this.type = payload
  }
  @Mutation
  setConfirmed(payload: boolean) {
    this.confirmed = payload
  }
  @Mutation
  setConfirmAction(payload: any) {
    this.confirmAction = payload
  }
  @Mutation
  setContent({ title, message, type, icon, initializer }: Dialog) {
    this.content = {
      title: '',
      message: '',
      type: '',
      icon: false,
      initializer: ''
    }
    if (title) this.content.title = title
    if (message) this.content.message = message
    if (type) this.content.type = type
    if (icon) this.content.icon = icon
    if (initializer) this.content.initializer = initializer
  }
}
