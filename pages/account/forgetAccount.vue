<template>
  <div>
    <div v-show="currentTab === 0">
      <h2 class="login__title">協助您找回帳號</h2>
      <p class="login__subtext">
        請輸入手機號碼以確認身份，我們會協助您找回帳號
      </p>
    </div>
    <div v-show="currentTab === 1">
      <h2 class="login__title">{{ username }}，您好</h2>
      <p class="login__subtext">請選擇您要將重置密碼信寄送至哪個服務做查看？</p>
    </div>
    <div v-show="currentTab === 2">
      <p class="login__subtitle">請稍候，我們正將您導至STAYFUN登入頁</p>
    </div>
    <div>
      <ValidationObserver>
        <b-container>
          <b-row v-show="currentTab === 0">
            <b-col cols="24">
              <ValidationProvider rules="required" v-slot="{ errors }">
                <BaseLabel
                  :hint="{
                    text: errors.length ? errors[0] : '',
                    type: 'warning'
                  }"
                  :valid="!errors.length"
                >
                  <BaseSelect
                    :options="countryCodeList"
                    v-model="phoneNumberPrefix"
                    placeholder="請選擇國碼"
                    :valid="!errors.length"
                  ></BaseSelect>
                </BaseLabel>
              </ValidationProvider>
            </b-col>
            <b-col cols="8" class="loginInputMarginTop">
              <BaseLabel>
                <BaseInput
                  type="text"
                  id="phoneNumberPrefix"
                  :value="phoneNumberPrefix"
                  :disabled="true"
                  :valid="true"
                  :center="true"
                />
              </BaseLabel>
            </b-col>
            <b-col cols="16" class="loginInputMarginTop">
              <ValidationProvider rules="required|max:50" v-slot="{ errors }">
                <BaseLabel
                  :hint="{
                    text: errors.length ? errors[0] : '',
                    type: 'warning'
                  }"
                  :valid="!errors.length"
                >
                  <BaseInput
                    type="text"
                    placeholder="請輸入電話號碼"
                    id="phoneNumber"
                    @input="form.phoneNumber = $event"
                    :value="form.phoneNumber"
                    :valid="!errors.length"
                  />
                </BaseLabel>
              </ValidationProvider>
            </b-col>
            <b-col cols="24" v-show="phoneNumberError">
              <p class="login__generalError">{{ phoneNumberError }}</p>
            </b-col>
            <b-col cols="24" class="loginInputMarginTop">
              <BaseButton
                :type="
                  form.phoneNumber === '' || form.phoneNumberPrefix === ''
                    ? 'greyOne'
                    : 'primary'
                "
                display="block"
                :disabled="
                  form.phoneNumber === '' || form.phoneNumberPrefix === ''
                "
                size="lg"
                @click="handleSubmit"
                >確認</BaseButton
              >
            </b-col>
            <b-col cols="24" class="loginInputMarginTop">
              <p
                class="login__bottomHint"
                @mouseover="toolTipStatus = true"
                @mouseleave="toolTipStatus = false"
                @dblclick="toolTipStatus = true"
                v-tooltip.bottom="{
                  content:
                    '未開通帳戶無法使用忘記帳號功能，與忘記密碼功能（企業導入Email除外），請您聯繫福委取得帳號',
                  show: toolTipStatus,
                  trigger: 'manual'
                }"
              >
                您的帳戶未開通/未認證嗎？
              </p>
            </b-col>
          </b-row>
          <b-row v-show="currentTab === 1">
            <b-col cols="24" class="loginInputMarginTop">
              <BaseButton
                type="primary"
                display="block"
                @click="handleSendRecovery(0)"
              >
                <div class="login__recoverBtn">
                  <fa
                    :icon="['fas', 'comment-dots']"
                    class="login__recoverIcon"
                  ></fa>
                  <span class="login__recoverText">傳送簡訊至 {{ phone }}</span>
                </div>
              </BaseButton>
            </b-col>
            <b-col cols="24" class="loginInputMarginTop">
              <BaseButton
                type="primary"
                display="block"
                @click="handleSendRecovery(1)"
              >
                <div class="login__recoverBtn">
                  <fa :icon="['far', 'envelope']"></fa>
                  <span class="login__recoverText">
                    傳送Email至 {{ email }}
                  </span>
                </div>
              </BaseButton>
            </b-col>
          </b-row>
          <b-row v-show="currentTab === 2">
            <b-col cols="24">
              <div class="login__mainpic"></div>
              <p class="login__maintitle">
                已傳送帳號至您的{{ recoverMethod === 0 ? '號碼' : ' Email' }}
              </p>
              <p class="login__mainsubtitle">請前往查看STAYFUN帳號資訊</p>
            </b-col>
            <b-col cols="24" class="loginInputMarginTop">
              <BaseButton
                type="primary"
                display="block"
                @click=";(currentTab = 0), $router.push('/account')"
              >
                前往登入頁
              </BaseButton>
            </b-col>
          </b-row>
        </b-container>
      </ValidationObserver>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'nuxt-property-decorator'
import { ProxyRequestObject, ResponseObject } from 'Http'
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import { $axios } from '~/utils/api'
import BaseInput from '~/components/BaseInput.vue'
import BaseButton from '~/components/BaseButton.vue'
import BaseLabel from '~/components/BaseLabel.vue'
import { authStore } from '~/store'

@Component({
  layout: 'account',
  components: {
    BaseInput,
    BaseButton,
    BaseLabel,
    ValidationObserver,
    ValidationProvider
  }
})
export default class ForgetAccount extends Vue {
  public toolTipStatus: boolean = false

  public phoneNumberError: string = ''

  public phoneNumberPrefix: string = '+886'
  public form: any = {
    phoneNumber: ''
  }

  public currentTab: number = 0
  public recoverMethod: number = 0

  public async handleSubmit() {
    try {
      this.$nuxt.$loading.start()
      await authStore.getAccountHint({
        dialcode: this.phoneNumberPrefix,
        keyword: this.form.phoneNumber
      })
      this.currentTab = 1
    } catch (e) {
      // get acc hint error
      this.phoneNumberError = '找不到您的手機號碼，可能您尚未開通帳戶'
    } finally {
      this.$nuxt.$loading.finish()
    }
  }

  public async handleSendRecovery(type: number) {
    this.recoverMethod = type
    try {
      this.$nuxt.$loading.start()
      await this.sendAccountLookUpRequest(type)
      this.currentTab = 2
      this.$nuxt.$loading.finish()
    } catch (e) {
      // send acc sms/email error
    }
  }

  get email() {
    return Object.keys(authStore.accountHint).length
      ? authStore.accountHint.email
      : ''
  }

  get phone() {
    return Object.keys(authStore.accountHint).length
      ? authStore.accountHint.mobilephonenumber
      : ''
  }

  get username() {
    return Object.keys(authStore.accountHint).length
      ? authStore.accountHint.username
      : ''
  }

  public async sendAccountLookUpRequest(type: number) {
    const requestBody: ProxyRequestObject = {
      endpoint: '/api/auth/accountlookup',
      key: process.env.apiKey,
      data: {
        mobilephonenumber: this.form.phoneNumber,
        type
      },
      method: 'post'
    }
    if (type === 0) requestBody.data.dialcode = this.phoneNumberPrefix

    const result: ResponseObject = await $axios.post('/auth', requestBody)
    switch (result.data.syscode) {
      case 200:
        return result.data.data
      case 40402:
        // Account does not exist
        throw new Error('找不到您的手機號碼，有可能您尚未開通帳戶')
      case 40102:
        // Password Error
        return 40102
      case 400:
        return 400
      default:
        return null
    }
  }

  get countryCodeList() {
    return authStore.countryCode
      ? authStore.countryCode.map((item: any) => ({
          ...item,
          label: item.countryname,
          value: item.dialcode
        }))
      : []
  }

  @Watch('currentTab')
  onTabChange(newVal: number) {
    if (newVal === 2) {
      const timer = setTimeout(() => {
        clearTimeout(timer)
        this.$router.push('/account')
      }, 3000)
    } else if (newVal > 2) {
      this.$router.push('/account')
    }
  }

  public async fetch() {
    this.currentTab = 0
    await authStore.getCountryCode()
  }

  public beforeRouteEnter(to: any, from: any, next: any) {
    if (to.params.active) {
      next()
    } else {
      next('/account')
    }
  }
}
</script>
