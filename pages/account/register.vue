<template>
  <div>
    <h2 class="login__title" v-show="currentTab === 0">綁定手機</h2>
    <section v-show="currentTab === 1">
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
    </section>
    <section v-show="currentTab === 2">
      <h2 class="login__title">設定您的Email帳號</h2>
      <p class="login__subtext">請設定您的Email帳號， 設定完成後將可使用此Email作為帳號登入使用</p>
    </section>
    <section v-show="currentTab === 3">
      <h2 class="login__title">設定您的新密碼</h2>
      <p class="login__subtext">請設定您的新密碼，未來請使用此密碼登入</p>
      <p class="login__subtext">密碼規則：8-12字 包含英文大小寫字母與數字</p>
    </section>
    <validation-observer v-slot="{ invalid }">
      <b-container>
        <b-row v-show="currentTab === 0">
          <b-col cols="24">
            <div class="login__hinttext loginInputMarginTop">
              <p>為確保您的帳戶安全，</p>
              <p>如帳戶名稱、密碼與訂單通知，請您輸入手機號碼進行認證</p>
            </div>
          </b-col>
          <b-col cols="24">
            <validation-provider rules="required" v-slot="{ errors }">
              <base-label
                :hint="{
                  text: errors.length ? errors[0] : '',
                  type: 'warning'
                }"
                :valid="!errors.length"
              >
                <base-select
                  :options="countryCodeList"
                  v-model="phoneNumberPrefix"
                  placeholder="請選擇國碼"
                  :valid="!errors.length"
                ></base-select>
              </base-label>
            </validation-provider>
          </b-col>
          <b-col cols="8" class="loginInputMarginTop">
            <base-label>
              <base-input
                type="text"
                id="phoneNumberPrefix"
                :value="phoneNumberPrefix"
                :disabled="true"
                :valid="true"
                :center="true"
              />
            </base-label>
          </b-col>
          <b-col cols="16" class="loginInputMarginTop">
            <validation-provider
              :rules="`required|numeric|${
                phoneNumberPrefix === '+886'
                  ? 'taiwanPhone'
                  : phoneNumberPrefix === '+86'
                  ? 'chinaPhone'
                  : 'max:20'
              }`"
              v-slot="{ errors }"
            >
              <base-label
                :hint="{
                  text: errors.length ? errors[0] : '',
                  type: 'warning'
                }"
                :valid="!errors.length"
              >
                <base-input
                  type="text"
                  placeholder="請輸入電話號碼"
                  id="phoneNumber"
                  @input="form.phoneNumber = $event"
                  :value="form.phoneNumber"
                  :valid="!errors.length"
                />
              </base-label>
            </validation-provider>
          </b-col>
          <b-col cols="24" class="loginInputMarginTop">
            <base-button
              :type="invalid ? 'greyOne' : 'primary'"
              display="block"
              :disabled="invalid"
              size="lg"
              @click="handleGetVerificationCode"
            >取得驗證碼</base-button>
          </b-col>
        </b-row>
      </b-container>
    </validation-observer>
    <validation-observer v-slot="{ invalid }">
      <b-container>
        <b-row v-show="currentTab === 1">
          <b-col
            cols="4"
            class="loginInputMarginTop"
            v-for="(value, key) of phoneSixDigit"
            :key="key"
          >
            <validation-provider rules="required|max:1|numeric" v-slot="{ errors }">
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
                @click="handleGetVerificationCode"
              >重新發送</span>
              <span v-show="timer > 0">
                {{
                `00:${
                2 > timer.toString().length ? '0' + timer.toString() : timer
                }`
                }}
              </span>
            </p>
            <BaseButton
              :type="
                !isPhoneVerificationAllowed || invalid ? 'greyOne' : 'primary'
              "
              display="block"
              :disabled="!isPhoneVerificationAllowed || invalid"
              size="lg"
              @click="handleSendChallengeCode"
            >確認</BaseButton>
            <BaseButton
              type="greyTwoOutline"
              display="block"
              size="lg"
              @click="currentTab = 0"
              class="loginInputMarginTop"
            >上一步</BaseButton>
          </b-col>
        </b-row>
      </b-container>
    </validation-observer>
    <validation-observer v-slot="{ invalid }">
      <b-container>
        <b-row v-show="currentTab === 2">
          <b-col cols="24" class="loginInputMarginTop">
            <validation-provider rules="required|max:50|isEmail" v-slot="{ errors }">
              <base-label
                :valid="!errors.length"
                text="Email 帳號"
                :hint="{
                  type: 'warning',
                  text: errors.length ? errors[0] : ''
                }"
              >
                <base-input
                  type="text"
                  placeholder="請輸入您的 Email"
                  @input="registerForm.email = $event"
                  :value="registerForm.email"
                  :valid="!errors.length"
                />
              </base-label>
            </validation-provider>
          </b-col>
          <b-col cols="24" class="loginInputMarginTop">
            <validation-provider rules="required|max:50|isEmail" v-slot="{ errors }">
              <base-label
                :valid="
                  !errors.length &&
                  registerForm.confirmEmail === registerForm.email
                "
                :hint="{
                  type: 'warning',
                  text: errors.length
                    ? errors[0]
                    : registerForm.confirmEmail !== registerForm.email
                    ? '確認 Email 內容不相同'
                    : ''
                }"
              >
                <base-input
                  type="text"
                  placeholder="請再次輸入您的 Email"
                  @input="registerForm.confirmEmail = $event"
                  :value="registerForm.confirmEmail"
                  :valid="
                    !errors.length &&
                    registerForm.confirmEmail === registerForm.email
                  "
                />
              </base-label>
            </validation-provider>
          </b-col>
          <b-col cols="24" class="loginInputMarginTop">
            <BaseButton
              :type="
                invalid || registerForm.confirmEmail !== registerForm.email
                  ? 'greyOne'
                  : 'primary'
              "
              display="block"
              :disabled="
                invalid || registerForm.confirmEmail !== registerForm.email
              "
              size="lg"
              @click="handleEmailRegistration"
            >確認</BaseButton>
          </b-col>
        </b-row>
      </b-container>
    </validation-observer>
    <validation-observer v-slot="{ invalid }">
      <b-container>
        <b-row v-show="currentTab === 3">
          <b-col cols="24" class="loginInputMarginTop">
            <validation-provider rules="required|max:12|min:8|isPassword" v-slot="{ errors }">
              <base-label
                :valid="!errors.length"
                text="密碼"
                :hint="{
                  type: 'warning',
                  text: errors.length ? errors[0] : ''
                }"
              >
                <base-input
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="請輸入您的密碼"
                  @input="registerForm.password = $event"
                  :value="registerForm.password"
                  :valid="!errors.length"
                >
                  <template v-slot:icon>
                    <span>
                      <fa
                        :icon="['far', 'eye-slash']"
                        class="login__icon"
                        :class="{
                          'login__icon--whiteOne': !showPassword,
                          'login__icon--primary': showPassword
                        }"
                        @click="showPassword = !showPassword"
                      />
                    </span>
                  </template>
                </base-input>
              </base-label>
            </validation-provider>
          </b-col>
          <b-col cols="24" class="loginInputMarginTop">
            <validation-provider rules="required|max:12|min:8|isPassword" v-slot="{ errors }">
              <base-label
                :valid="
                  !errors.length &&
                  registerForm.confirmPassword === registerForm.password
                "
                :hint="{
                  type: 'warning',
                  text: errors.length
                    ? errors[0]
                    : registerForm.confirmPassword !== registerForm.password
                    ? '密碼內容不相同'
                    : ''
                }"
              >
                <base-input
                  :type="showConfirmPassword ? 'text' : 'password'"
                  placeholder="請再次確認您的密碼"
                  @input="registerForm.confirmPassword = $event"
                  :value="registerForm.confirmPassword"
                  :valid="
                    !errors.length &&
                    registerForm.confirmPassword === registerForm.password
                  "
                >
                  <template v-slot:icon>
                    <span>
                      <fa
                        :icon="['far', 'eye-slash']"
                        class="login__icon"
                        :class="{
                          'login__icon--whiteOne': !showConfirmPassword,
                          'login__icon--primary': showConfirmPassword
                        }"
                        @click="showConfirmPassword = !showConfirmPassword"
                      />
                    </span>
                  </template>
                </base-input>
              </base-label>
            </validation-provider>
          </b-col>
          <b-col cols="24" class="loginInputMarginTop">
            <base-button
              :type="
                invalid ||
                registerForm.confirmPassword !== registerForm.password
                  ? 'greyOne'
                  : 'primary'
              "
              display="block"
              :disabled="
                invalid ||
                registerForm.confirmPassword !== registerForm.password
              "
              size="lg"
              @click="handlePasswordRegistration"
            >確認</base-button>
          </b-col>
        </b-row>
      </b-container>
    </validation-observer>
    <default-dialog
      :active="dialogState"
      @accept="handleDialogClose"
      @cancel="handleDialogClose"
      @confirm="handleDialogConfirm"
      :message="dialogContent.message"
      :title="dialogContent.title"
      :type="dialogContent.type"
      :icon="dialogContent.icon"
    ></default-dialog>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'nuxt-property-decorator'
import { ProxyRequestObject, ResponseObject } from 'Http'
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import { $axios } from '~/utils/api'
import BaseInput from '~/components/BaseInput.vue'
import BaseButton from '~/components/BaseButton.vue'
import BaseSelect from '~/components/BaseSelect.vue'
import BaseLabel from '~/components/BaseLabel.vue'
import DefaultDialog from '~/components/DefaultDialog.vue'
import { authStore, dialogStore } from '~/store'

@Component({
  layout: 'account',
  components: {
    BaseInput,
    BaseButton,
    BaseSelect,
    BaseLabel,
    ValidationObserver,
    ValidationProvider,
    DefaultDialog
  }
})
export default class Register extends Vue {
  public currentTab: number = 0

  public showPassword: boolean = false

  public showConfirmPassword: boolean = false

  public async handlePasswordRegistration() {
    try {
      this.$nuxt.$loading.start()
      await this.sendPasswordRegistrationRequest()
    } catch (e) {
      // error
      if (e.message === '密碼格式不符') {
        dialogStore.setContent({
          title: '密碼格式不符',
          icon: true,
          type: 'accept'
        })
      } else if (e.message === '此帳號的密碼已開通') {
        dialogStore.setContent({
          title: '此帳號的密碼已開通',
          message: '您已經可以正常登入',
          icon: true,
          type: 'confirm',
          initializer: 'account-password-registration-already-registered'
        })
      } else {
        dialogStore.setContent({
          title: '您的請求無法被完成，請稍後再試',
          icon: true,
          type: 'accept'
        })
      }
      dialogStore.setActive(true)
      dialogStore.setMaskActive(true)
    } finally {
      this.$nuxt.$loading.finish()
    }
  }

  public async handleEmailRegistration() {
    try {
      this.$nuxt.$loading.start()
      await this.sendEmailRegistrationRequest()
      this.currentTab = 3
    } catch (e) {
      // error
      if (e.message === 'Email 格式不符') {
        dialogStore.setContent({
          title: 'Email 格式不符',
          icon: true,
          type: 'accept'
        })
      } else {
        dialogStore.setContent({
          title: '您的請求無法被完成，請稍後再試',
          icon: true,
          type: 'accept'
        })
      }
      dialogStore.setActive(true)
      dialogStore.setMaskActive(true)
    } finally {
      this.$nuxt.$loading.finish()
    }
  }

  public registerForm: any = {
    email: '',
    confirmEmail: '',
    password: '',
    confirmPassword: ''
  }

  public phoneSixDigit: any = {
    0: '',
    1: '',
    2: '',
    3: '',
    4: '',
    5: ''
  }

  get phone() {
    return Object.keys(authStore.accountHint).length
      ? authStore.accountHint.mobilephonenumber
      : ''
  }

  public keywordError: string = ''

  public timer: number = 0

  public timeout: any = null

  public expireTimer: number = 0

  public expireTimeout: any = null

  get isPhoneVerificationAllowed(): boolean {
    let valid = true
    Object.keys(this.phoneSixDigit).forEach((key) => {
      if (this.phoneSixDigit[key] === '') {
        valid = false
      }
    })
    return valid
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
    if (newVal > 3) {
      this.$router.push('/account')
    }
    if (newVal !== 1) {
      clearInterval(this.timeout)
      clearInterval(this.expireTimeout)
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

  public verificationKey: string = ''

  public phoneNumberPrefix: string = '+886'

  public form: any = {
    phoneNumber: ''
  }

  public setTimer() {
    clearInterval(this.timeout)
    this.timer = 59
    this.timeout = setInterval(() => {
      if (this.timer > 0) {
        this.timer -= 1
      } else {
        clearInterval(this.timeout)
      }
    }, 1000)
  }

  public setResetTimer() {
    clearInterval(this.expireTimeout)
    this.expireTimer = 60 * 5
    this.expireTimeout = setInterval(() => {
      if (this.expireTimer > 0) {
        this.expireTimer -= 1
      } else {
        clearInterval(this.expireTimeout)
      }
    }, 1000)
  }

  public async handleGetVerificationCode() {
    try {
      this.$nuxt.$loading.start()
      const { isDuplicated } = await this.sendCheckMobileDuplicateRequest()
      if (isDuplicated) {
        throw new Error('此號碼已經被使用')
      }
      const result = await this.sendGetVerificationCodeRequest()
      this.verificationKey = result.verificationKey.toString()
      this.setTimer()
      this.setResetTimer()
      this.currentTab = 1
    } catch (e) {
      if (
        e.message ===
        '您取得驗證碼的次數過於頻繁，請於一分鐘後再次嘗試或前往收訊較佳的地方進行驗證'
      ) {
        dialogStore.setContent({
          title: '提醒您',
          icon: true,
          message:
            '您取得驗證碼的次數過於頻繁，請於一分鐘後再次嘗試或前往收訊較佳的地方進行驗證',
          type: 'accept'
        })
      } else if (e.message === '您的帳號已經綁定號碼') {
        dialogStore.setContent({
          title: '提醒您',
          icon: true,
          message: '您的帳號已經綁定號碼，將跳轉至綁定 Email 頁面',
          type: 'accept'
        })
        this.currentTab = 2
      } else if (e.message === '此號碼已經被使用') {
        dialogStore.setContent({
          title: '提醒您',
          icon: true,
          message: '此號碼已經被使用',
          type: 'accept'
        })
      } else {
        dialogStore.setContent({
          title: '您的請求無法被完成，請稍後再試',
          icon: true,
          type: 'accept'
        })
      }
      dialogStore.setMaskActive(true)
      dialogStore.setActive(true)
    } finally {
      this.$nuxt.$loading.finish()
    }
  }

  get dialogState() {
    return dialogStore.active
  }

  get dialogContent() {
    return dialogStore.content
  }

  public handleDialogClose() {
    dialogStore.setActive(false)
    dialogStore.setMaskActive(false)
    const initializer = dialogStore.content.initializer
    if (initializer === 'account-password-registration-already-registered') {
      this.$router.push('/account')
    }
  }

  public handleDialogConfirm() {
    dialogStore.setActive(false)
    dialogStore.setMaskActive(false)
    const initializer = dialogStore.content.initializer
    if (initializer === 'account-password-registration-already-registered') {
      this.$router.push('/account')
    }
  }

  public async sendCheckMobileDuplicateRequest() {
    const requestBody: ProxyRequestObject = {
      endpoint: '/api/auth/common/IsMobileDuplicated',
      key: process.env.apiKey,
      data: {
        dialcode: this.phoneNumberPrefix,
        mobilephonenumber: this.form.phoneNumber
      },
      method: 'post',
      token: this.$cookies.get('accessToken')
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

  public async sendGetVerificationCodeRequest() {
    const requestBody: ProxyRequestObject = {
      endpoint: '/api/Accounts/@me/Mobiles/SendVerificationCodeWithDialCode',
      key: process.env.apiKey,
      data: {
        dialcode: this.phoneNumberPrefix,
        mobilephonenumber: this.form.phoneNumber
      },
      method: 'post',
      token: this.$cookies.get('accessToken')
    }

    const result: ResponseObject = await $axios.post('/api', requestBody)
    switch (result.data.syscode) {
      case 200:
        return result.data.data
      case 403:
        throw new Error(
          '您取得驗證碼的次數過於頻繁，請於一分鐘後再次嘗試或前往收訊較佳的地方進行驗證'
        )
      case 40006:
        throw new Error('您的帳號已經綁定號碼')
      case 500:
        throw new Error('Server Error')
      default:
        return null
    }
  }

  public async sendChallengeCodeRequest(code: string) {
    const requestBody: ProxyRequestObject = {
      endpoint: '/api/Accounts/@me/Mobiles/RegisterWithDialCode',
      key: process.env.apiKey,
      data: {
        dialcode: this.phoneNumberPrefix,
        verificationCode: code,
        verificationKey: this.verificationKey,
        mobilephonenumber: this.form.phoneNumber
      },
      token: this.$cookies.get('accessToken'),
      method: 'post'
    }

    const result: ResponseObject = await $axios.post('/api', requestBody)
    switch (result.data.syscode) {
      case 200:
        return result.data.data
      case 40010:
        throw new Error('驗證失敗或已失效，請重新輸入正確的驗證碼')
      case 403:
        throw new Error('No Token')
      default:
        return null
    }
  }

  public async sendEmailRegistrationRequest() {
    const requestBody: ProxyRequestObject = {
      endpoint: '/api/Accounts/@me',
      key: process.env.apiKey,
      data: {
        email: this.registerForm.email
      },
      token: this.$cookies.get('accessToken'),
      method: 'patch'
    }

    const result: ResponseObject = await $axios.post('/api', requestBody)
    switch (result.data.syscode) {
      case 200:
        return result.data.data
      case 403:
        throw new Error('No Token')
      case 40003:
        throw new Error('Email 格式不符')
      case 500:
        throw new Error('Server Error')
      default:
        return null
    }
  }

  public async sendPasswordRegistrationRequest() {
    const requestBody: ProxyRequestObject = {
      endpoint: '/api/Accounts/@me/Activate',
      key: process.env.apiKey,
      data: {
        password: this.registerForm.password,
        newpassword: this.registerForm.password
      },
      token: this.$cookies.get('accessToken'),
      method: 'post'
    }

    const result: ResponseObject = await $axios.post('/api', requestBody)
    switch (result.data.syscode) {
      case 200:
        return result.data.data
      case 403:
        throw new Error('No Token')
      case 40003:
        throw new Error('密碼格式不符')
      case 500:
        throw new Error('Server Error')
      case 40008:
        throw new Error('此帳號的密碼已開通')
      default:
        return null
    }
  }

  public async fetch() {
    await authStore.getCountryCode()
  }

  public beforeRouteEnter(to: any, from: any, next: Function) {
    if (!from) {
      next('/account')
    } else {
      if (from.name !== 'account') {
        next('/account')
      }
      next()
    }
  }
}
</script>
