<template>
  <div>
    <h2 class="login__title">登入</h2>
    <div>
      <ValidationObserver>
        <b-container>
          <b-row>
            <b-col cols="24">
              <ValidationProvider rules="required|max:50" v-slot="{ errors }">
                <BaseLabel
                  text="帳號"
                  :hint="{
                    text: errors.length ? errors[0] : usernameHint,
                    type: 'warning'
                  }"
                  :valid="!errors.length && usernameValid"
                >
                  <BaseInput
                    @blur="handleAccountBlur"
                    placeholder="請輸入您的STAYFUN帳號或Email"
                    type="text"
                    id="account"
                    @input=";(form.username = $event), (usernameValid = true)"
                    :value="form.username"
                    :valid="!errors.length && usernameValid"
                  >
                    <template v-slot:icon>
                      <span
                        @mouseover="toolTipStatus = true"
                        @mouseleave="toolTipStatus = false"
                        v-tooltip.bottom="{
                          content:
                            '您可以使用企業提供您的帳號「企業簡碼-工號」或您設定的「Email帳號」進行登入',
                          show: toolTipStatus,
                          trigger: 'manual'
                        }"
                      >
                        <fa
                          :icon="['far', 'question-circle']"
                          class="login__icon login__icon--primary"
                        />
                      </span>
                    </template>
                  </BaseInput>
                </BaseLabel>
              </ValidationProvider>
            </b-col>
            <b-col cols="24" class="loginInputMarginTop">
              <ValidationProvider rules="required|max:50" v-slot="{ errors }">
                <BaseLabel
                  text="密碼"
                  :hint="{
                    text: errors.length ? errors[0] : passwordHint,
                    type: 'warning'
                  }"
                  :valid="!errors.length && passwordValid"
                >
                  <BaseInput
                    :type="showPassword ? 'text' : 'password'"
                    placeholder="請輸入您的密碼(密碼有區分大小寫)"
                    id="password"
                    @input=";(form.password = $event), (passwordValid = true)"
                    :value="form.password"
                    @blur="handlePasswordBlur"
                    :valid="!errors.length && passwordValid"
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
                  </BaseInput>
                </BaseLabel>
              </ValidationProvider>
            </b-col>
            <b-col cols="24" class="mt-3">
              <BaseCheckbox
                id="rememberpassword"
                v-model="form.isRemember"
                :value="form.isRemember"
              >
                記住我的帳號(請勿在公共場所使用此功能)
              </BaseCheckbox>
            </b-col>
            <b-col cols="24" class="loginInputMarginTop">
              <BaseButton
                type="primary"
                display="block"
                size="lg"
                @click="handleSignIn"
                >確認</BaseButton
              >
            </b-col>
          </b-row>
        </b-container>
      </ValidationObserver>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import { SignInForm } from 'SignIn'
import BaseInput from '~/components/BaseInput.vue'
import BaseCheckbox from '~/components/BaseCheckbox.vue'
import BaseButton from '~/components/BaseButton.vue'
import BaseLabel from '~/components/BaseLabel.vue'
import DefaultModal from '~/components/DefaultModal.vue'
import { authStore, dialogStore } from '~/store'

@Component({
  layout: 'account',
  components: {
    BaseInput,
    BaseCheckbox,
    BaseButton,
    BaseLabel,
    ValidationObserver,
    ValidationProvider,
    DefaultModal
  }
})
export default class Login extends Vue {
  public toolTipStatus: boolean = false

  public showPassword: boolean = false
  public rememberPassword: boolean = false
  public usernameValid: boolean = true
  public passwordValid: boolean = true
  public usernameHint: string = '請輸入帳號'
  public passwordHint: string = '請輸入密碼'

  public form: SignInForm = {
    username: '',
    password: '',
    isRemember: false,
    isCheckPrivacy: false,
    privacyVersionName: '',
    accountToken: ''
  }

  public handleAccountBlur(): void {
    if (this.form.username === '') this.usernameValid = false
    else this.usernameValid = true
    this.usernameHint = '請輸入帳號'
  }

  public handlePasswordBlur(): void {
    if (this.form.password === '') this.passwordValid = false
    else this.passwordValid = true
    this.passwordHint = '請輸入密碼'
  }

  public setSaveUsername(): void {
    localStorage.setItem('uname', this.form.username)
  }

  public removeSaveUsername(): void {
    localStorage.removeItem('uname')
  }

  public async handleSignIn(): Promise<any> {
    this.$nuxt.$loading.start()
    if (this.form.isRemember) {
      this.setSaveUsername()
    } else {
      this.removeSaveUsername()
    }
    try {
      const result = await authStore.getAccessToken(this.form)
      this.$nuxt.$loading.finish()
      if (result === 40102) {
        this.passwordValid = false
        this.passwordHint = '密碼輸入錯誤'
      } else if (result === 406) {
        this.usernameValid = false
        this.usernameHint = '帳號輸入錯誤'
      } else if (result === 400) {
        this.passwordValid = false
        this.usernameValid = false
        this.usernameHint = '帳號輸入錯誤'
      } else if (result.status && result.status === 4032) {
        authStore.setShowPrivacy(true)
        dialogStore.setMaskActive(true)
        authStore.setAccountToken(result.data)
      } else if (result) {
        const { AccessToken } = result

        this.$cookies.set('accessToken', AccessToken, {
          path: '/',
          maxAge: 60 * 60 * 24 * 7,
          sameSite: true
        })
        this.$router.push({ name: 'index' })
      }
    } catch (e) {
      // error
    }
  }

  public mounted() {
    const username: undefined | string | null = localStorage.getItem('uname')
    if (username) {
      this.form.username = username
      this.form.isRemember = true
    }
  }
}
</script>
