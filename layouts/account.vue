<template>
  <div>
    <b-container fluid="xl">
      <b-row>
        <b-col cols="24" lg="12" class="px-0 d-none d-lg-block position-static">
          <aside class="login__aside">
            <div class="login__carouselBox">
              <b-carousel
                v-model="slide"
                :interval="4000"
                indicators
                background="transparent"
                @sliding-start="onSlideStart"
                @sliding-end="onSlideEnd"
              >
                <b-carousel-slide v-for="item in slides" :key="item.id">
                  <template v-slot:img>
                    <img
                      :src="item.imgurl"
                      alt=""
                      class="img-fluid"
                      width="100%"
                      height="500px"
                    />
                    <p class="login__carouselText">{{ item.text }}</p>
                  </template>
                </b-carousel-slide>
              </b-carousel>
            </div>
            <footer class="login__footer">STAY here, always have FUN.</footer>
          </aside>
        </b-col>
        <b-col cols="24" lg="12" class="position-static">
          <main class="login__main">
            <div class="login__textBox">
              <div class="login__logo"></div>
              <Nuxt />
            </div>
            <div class="loginmainfooter">
              <div v-if="$route.name === 'account'">
                <span
                  class="loginmainfooter__btn"
                  @click="
                    $router.push({
                      name: 'account-forgetAccount',
                      params: { active: true }
                    })
                  "
                  >忘記帳號
                </span>
                |
                <span
                  class="loginmainfooter__btn"
                  @click="
                    $router.push({
                      name: 'account-forgetPassword',
                      params: { active: true }
                    })
                  "
                  >忘記密碼
                </span>
              </div>
              <section class="loginmainfooter__footerBox">
                <div class="loginmainfooter__footer">
                  Copyright © MAYO Human Capital Inc.
                </div>
                <div class="loginmainfooter__footer">
                  All Right Reserved
                  <a
                    href="javascript:;"
                    @click="$router.push({ name: 'policies' })"
                    class="loginmainfooter__btninline"
                    >服務條款
                  </a>
                </div>
              </section>
            </div>
          </main>
        </b-col>
      </b-row>
    </b-container>
    <DefaultModal :active="modalState" :button="false">
      <div class="loginModal">
        <div class="loginModal__titlebox">
          <h2 class="loginModal__title">隱私權政策更新</h2>
          <p class="loginModal__subtitle">
            為了保護您個人資料的安全，STAYFUN已更新隱私權政策，請詳閱以下內容
          </p>
        </div>
        <section class="loginModal__body" v-html="privacyHtml"></section>
        <div class="loginModal__btnbox">
          <BaseCheckbox
            class="loginModal__privacyBox"
            v-model="isPrivacyAcknowledged"
            :value="isPrivacyAcknowledged"
            id="privacyAcknowledgement"
          >
            已詳細閱讀隱私權政策
          </BaseCheckbox>
          <BaseButton
            display="block"
            type="greyTwo"
            class="loginModal__smallBtn"
            @click="handleDisagreePrivacy"
          >
            不同意並登出
          </BaseButton>
          <BaseButton
            display="block"
            :type="isPrivacyAcknowledged ? 'primary' : 'greyOne'"
            class="loginModal__lgBtn"
            :disabled="!isPrivacyAcknowledged"
            @click="handleAgreePrivacy"
          >
            同意
          </BaseButton>
        </div>
      </div>
    </DefaultModal>
    <DefaultMask :active="maskState" />
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { authStore, dialogStore } from '~/store'
import auth from '~/middleware/auth'

interface images {
  text: string
  imgurl: string
  id: string
}

@Component
export default class AccountLayout extends Vue {
  get maskState() {
    return dialogStore.maskActive
  }

  slide: number = 0

  sliding: boolean = false

  slides: Array<images> = [
    {
      text: '手機即識別證 特約優惠帶著走',
      imgurl: '/img/carousel-1.png',
      id: '1'
    },
    {
      text: '多元合作夥伴 滿足您各式所需',
      imgurl: '/img/carousel-2.png',
      id: '2'
    },
    {
      text: '線上點選企業禮品 超值又便利',
      imgurl: '/img/carousel-3.png',
      id: '3'
    }
  ]

  onSlideStart(slide: number): void {
    this.sliding = true
  }

  onSlideEnd(slide: number): void {
    this.sliding = false
  }

  public isPrivacyAcknowledged: boolean = false

  get privacyHtml() {
    return authStore.privacyHtml
  }

  get modalState() {
    return authStore.showPrivacy
  }

  set modalState(status: boolean) {
    authStore.setShowPrivacy(status)
    dialogStore.setMaskActive(false)
  }

  public handleDisagreePrivacy() {
    this.modalState = false
    this.$nuxt.$loading.start()
    setTimeout(() => {
      this.$nuxt.$loading.finish()
    }, 1000)
  }

  public async handleAgreePrivacy() {
    try {
      this.modalState = false
      await this.sendSignInRequest()
      this.$router.push({ name: 'account-register' })
    } catch (e) {
      // error
    }
  }

  public async sendSignInRequest() {
    try {
      const { username, password, isRemember } = authStore.tempUserInfo
      await authStore.getAccessToken({
        username,
        password,
        isRemember,
        privacyVersionName: authStore.privacyVersionName
      })
    } catch (e) {}
  }

  public async mounted() {
    try {
      await authStore.getPrivacyContent()
    } catch (e) {
      // fail to get privacy content
    }
  }
}
</script>
