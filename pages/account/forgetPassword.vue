<template>
  <div>
    <div v-show="currentTab === 0">
      <h2 class="login__title">協助您重置密碼</h2>
      <p class="login__subtext">請輸入STAYFUN帳號以確認身份，我們會協助您重新設定密碼</p>
    </div>
    <div v-show="currentTab === 1 || currentTab === 1.5">
      <h2 class="login__title">{{ username }}，您好</h2>
      <p class="login__subtext" v-show="currentTab === 1">請選擇您要將重置密碼信寄送至哪個服務做查看？</p>
      <p class="login__subtext" v-show="currentTab === 1.5">請輸入您綁定的手機末４碼以確認身份，我們會協助您重新設定密碼</p>
    </div>
    <div v-show="currentTab === 1.75">
      <h2 class="login__title">手機號碼驗證中...</h2>
      <p class="login__subtext">您的驗證碼簡訊已發送至 {{ phone }}</p>
      <p class="login__subtext">
        請於
        <span>
          {{
          `${Math.floor(expireTimer / 60)}:${
          2 > (expireTimer % 60).toString().length
          ? '0' + (expireTimer % 60).toString()
          : expireTimer % 60
          }`
          }}
        </span>
        內輸入驗證碼完成驗證
      </p>
      <p class="login__titleAlert" v-show="expireTimer <= 0">驗證碼已失效，請重新發送</p>
    </div>
    <div v-show="currentTab === 2">
      <p class="login__subtitle">請稍候，我們正將您導至STAYFUN登入頁</p>
    </div>
    <div>
      <validation-observer>
        <b-container>
          <b-row v-show="currentTab === 0">
            <b-col cols="24" class="loginInputMarginTop">
              <validation-provider rules="required|max:50" v-slot="{ errors }">
                <base-label
                  text="帳號"
                  :hint="{
                    text: errors.length ? errors[0] : keywordError,
                    type: 'warning'
                  }"
                  :valid="!errors.length && !keywordError.length"
                >
                  <base-input
                    type="text"
                    placeholder="請輸入您的 STAYFUN 帳號或 Email"
                    id="email"
                    @input="form.keyword = $event"
                    :value="form.keyword"
                    :valid="!errors.length"
                  />
                </base-label>
              </validation-provider>
            </b-col>
            <b-col cols="24" class="loginInputMarginTop">
              <base-button
                :type="form.keyword === '' ? 'greyOne' : 'primary'"
                display="block"
                :disabled="form.keyword === ''"
                size="lg"
                @click="handleSubmit"
              >確認</base-button>
            </b-col>
          </b-row>
          <b-row v-show="currentTab === 1">
            <b-col cols="24" class="loginInputMarginTop">
              <base-button type="primary" display="block" @click="currentTab = 1.5">
                <div class="login__recoverBtn">
                  <fa :icon="['fas', 'comment-dots']" class="login__recoverIcon"></fa>
                  <span class="login__recoverText">傳送簡訊至 {{ phone }}</span>
                </div>
              </base-button>
            </b-col>
            <b-col cols="24" class="loginInputMarginTop">
              <base-button type="primary" display="block" @click="handleSendRecovery(1)">
                <div class="login__recoverBtn">
                  <fa :icon="['far', 'envelope']"></fa>
                  <span class="login__recoverText">
                    傳送Email至
                    <span>{{ email }}</span>
                  </span>
                </div>
              </base-button>
            </b-col>
          </b-row>
          <b-row v-show="currentTab === 1.5">
            <b-col cols="8" class="loginInputMarginTop">
              <base-label>
                <base-input type="text" value="****" :valid="true" :disabled="true" :center="true" />
              </base-label>
            </b-col>
            <b-col cols="8" class="loginInputMarginTop">
              <base-label>
                <base-input
                  type="text"
                  value="**"
                  :valid="true"
                  max="4"
                  :disabled="true"
                  :center="true"
                />
              </base-label>
            </b-col>
            <b-col cols="8" class="loginInputMarginTop">
              <validation-provider rules="required|max:4" v-slot="{ errors }">
                <base-label :valid="!errors.length">
                  <base-input
                    type="text"
                    placeholder="****"
                    id="email"
                    @input="phoneLastFour = $event"
                    :value="phoneLastFour"
                    :valid="!errors.length"
                    max="4"
                    :center="true"
                  />
                </base-label>
              </validation-provider>
            </b-col>
            <b-col cols="24" v-show="keywordError">
              <p class="login__generalError">{{ keywordError }}</p>
            </b-col>
            <b-col cols="24" class="loginInputMarginTop">
              <base-button
                :type="phoneLastFour.length !== 4 ? 'greyOne' : 'primary'"
                display="block"
                :disabled="phoneLastFour.length !== 4"
                @click="handleSendSms"
              >確認</base-button>
            </b-col>
          </b-row>
          <b-row v-show="currentTab === 1.75">
            <b-col
              cols="4"
              class="loginInputMarginTop"
              v-for="(value, key) of phoneSixDigit"
              :key="key"
            >
              <validation-provider rules="required|max:1" v-slot="{ errors }">
                <base-label :valid="!errors.length">
                  <base-input
                    type="text"
                    placeholder="0"
                    @input="phoneSixDigit[key] = $event"
                    :value="phoneSixDigit[key]"
                    :valid="!errors.length"
                    :center="true"
                    maxlength="1"
                  />
                </base-label>
              </validation-provider>
            </b-col>
            <b-col cols="24" v-show="keywordError && expireTimer > 0">
              <p class="login__generalError">{{ keywordError }}</p>
            </b-col>
            <b-col cols="24" class="loginInputMarginTop">
              <p class="login__btnHint">
                <span class="login__btnHintText">未收到驗證碼？</span>
                <span class="login__resend" v-show="timer > 0">已發送</span>
                <span
                  class="login__resend"
                  :class="{ 'login__resend--active': timer === 0 }"
                  v-show="timer <= 0"
                  @click="handleSendSms"
                >重新發送</span>
                <span v-show="timer > 0">
                  {{
                  `00:${
                  2 > timer.toString().length ? '0' + timer.toString() : timer
                  }`
                  }}
                </span>
              </p>
              <base-button
                :type="!isPhoneVerificationAllowed ? 'greyOne' : 'primary'"
                display="block"
                :disabled="!isPhoneVerificationAllowed"
                size="lg"
                @click="handleSendChallengeCode"
              >確認</base-button>
              <base-button
                type="greyTwoOutline"
                display="block"
                size="lg"
                @click="currentTab = 1.5"
                class="loginInputMarginTop"
              >上一步</base-button>
            </b-col>
          </b-row>
          <b-row v-show="currentTab === 2">
            <b-col cols="24">
              <div class="login__mainpic"></div>
              <p class="login__maintitle">
                已傳送重置密碼信至您的{{
                recoverMethod === 0 ? '號碼' : ' Email'
                }}
              </p>
              <p class="login__mainsubtitle">
                請於
                <span>10</span>分鐘內完成重置密碼
              </p>
            </b-col>
            <b-col cols="24" class="loginInputMarginTop">
              <base-button
                type="primary"
                display="block"
                @click=";(currentTab = 0), $router.push('/account')"
              >前往登入頁</base-button>
            </b-col>
          </b-row>
        </b-container>
      </validation-observer>
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
  public currentTab: number = 0

  public recoverMethod: number = 0

  public keywordError: string = ''

  public form: any = {
    keyword: ''
  }

  public phoneLastFour: string = ''

  public phoneSixDigit: any = {
    0: '',
    1: '',
    2: '',
    3: '',
    4: '',
    5: ''
  }

  get isPhoneVerificationAllowed(): boolean {
    let valid = true
    Object.keys(this.phoneSixDigit).forEach((key) => {
      if (this.phoneSixDigit[key] === '') {
        valid = false
      }
    })
    return valid
  }

  public timer: number = 0

  public timeout: any = null

  public expireTimer: number = 0

  public expireTimeout: any = null

  public verificationKey: string = ''

  public async handleSendSms() {
    this.recoverMethod = 0
    try {
      this.$nuxt.$loading.start()
      const result = await this.sendAccountForgotRequest(0)
      this.verificationKey = result.verificationKey

      clearInterval(this.timeout)
      clearInterval(this.expireTimeout)
      this.timer = 59
      this.timeout = setInterval(() => {
        if (this.timer > 0) {
          this.timer -= 1
        } else {
          clearInterval(this.timeout)
        }
      }, 1000)
      this.expireTimer = 60 * 5
      this.expireTimeout = setInterval(() => {
        if (this.expireTimer > 0) {
          this.expireTimer -= 1
        } else {
          clearInterval(this.expireTimeout)
        }
      }, 1000)

      this.currentTab = 1.75
      this.keywordError = ''
    } catch (e) {
      // send sms error
      this.keywordError = '手機末四碼驗證錯誤'
    } finally {
      this.$nuxt.$loading.finish()
    }
  }

  public async handleSubmit() {
    try {
      this.$nuxt.$loading.start()
      await authStore.getAccountHint({
        keyword: this.form.keyword
      })
      this.currentTab = 1
      this.keywordError = ''
    } catch (e) {
      // get acc hint error
      this.keywordError = '找不到您的帳號'
    } finally {
      this.$nuxt.$loading.finish()
    }
  }

  public async handleSendRecovery(type: number) {
    this.recoverMethod = type
    try {
      this.$nuxt.$loading.start()
      await this.sendAccountForgotRequest(type)
      this.currentTab = 2
      this.$nuxt.$loading.finish()
    } catch (e) {
      // send acc sms/email error
    }
  }

  public async handleSendChallengeCode() {
    const challenge = Object.values(this.phoneSixDigit).join('')
    try {
      this.$nuxt.$loading.start()
      await this.sendChallengeCodeRequest(challenge)
      this.keywordError = ''
      this.currentTab = 2
    } catch (e) {
      this.keywordError = '驗證失敗或已失效，請重新輸入正確的驗證碼'
    } finally {
      this.$nuxt.$loading.finish()
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

  public async sendAccountForgotRequest(type: number) {
    const requestBody: ProxyRequestObject = {
      endpoint: '/api/auth/forgot',
      key: process.env.apiKey,
      data: {
        username: this.form.keyword,
        type
      },
      method: 'post'
    }
    if (type === 0) requestBody.data.verificationMobile = this.phoneLastFour

    const result: ResponseObject = await $axios.post('/auth', requestBody)
    switch (result.data.syscode) {
      case 200:
        return result.data.data
      case 40402:
        // Account does not exist
        throw new Error('找不到您的手機號碼，有可能您尚未開通帳戶')
      case 40016:
        // Last 4 Digits Verification Error
        throw new Error('手機末四碼驗證錯誤')
      case 400:
        return 400
      default:
        return null
    }
  }

  public async sendChallengeCodeRequest(code: string) {
    const requestBody: ProxyRequestObject = {
      endpoint: '/api/auth/forgot/challengeWithDialCode',
      key: process.env.apiKey,
      data: {
        username: this.form.keyword,
        verificationcode: code,
        verificationKey: this.verificationKey
      },
      method: 'post'
    }

    const result: ResponseObject = await $axios.post('/auth', requestBody)
    switch (result.data.syscode) {
      case 200:
        return result.data.data
      case 40010:
        throw new Error('驗證失敗或已失效，請重新輸入正確的驗證碼')
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
    this.keywordError = ''
    if (newVal > 2) {
      this.$router.push('/account')
    }
    if (newVal !== 1.75) {
      clearInterval(this.timeout)
      clearInterval(this.expireTimeout)
      this.resetLastSixDigit()
    }
  }

  public resetLastSixDigit() {
    this.phoneSixDigit = {
      0: '',
      1: '',
      2: '',
      3: '',
      4: '',
      5: ''
    }
  }

  public async fetch() {
    this.currentTab = 0
    await authStore.getCountryCode()
  }

  public beforeRouteEnter(to: any, from: any, next: any) {
    if (!to) {
      next('/account')
    }
    if (to.params.active) {
      next()
    } else {
      next('/account')
    }
  }
}
</script>
