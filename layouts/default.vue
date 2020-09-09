<template>
  <div>
    <default-header
      :menu="menu"
      @logout="handleLogout"
      :user="user"
      :logoUrl="headerLogoUrl"
    />
    <b-container>
      <b-row>
        <b-col cols="24" class="px-0 position-static">
          <nuxt
            keep-alive
            :keep-alive-props="{ exclude: ['funevents-serialno'] }"
          />
        </b-col>
      </b-row>
    </b-container>
    <default-footer />
    <client-only>
      <default-mask :active="maskState" />
    </client-only>
    <client-only>
      <default-scroll-to-button />
    </client-only>
    <client-only>
      <default-modal
        :active="modalState"
        v-if="gifts.length"
        @click="handleModalClose"
      >
        <div class="gift">
          <div class="gift__title"></div>
          <div class="gift__banner"></div>
          <div class="gift__maintitle"></div>
          <div class="gift__content">{{ gifts[0].title }}</div>
          <div class="gift__footer"></div>
        </div>

        <div>
          <base-button
            type="primary"
            display="block"
            @click="handleGetGift(gifts[0].announcementSerialNo)"
            >立即領取</base-button
          >
        </div>
      </default-modal>
    </client-only>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { ProxyRequestObject, ResponseObject } from 'Http'
import { $axios } from '~/utils/api'
import DefaultHeader from '~/components/DefaultHeader.vue'
import DefaultFooter from '~/components/DefaultFooter.vue'
import DefaultMask from '~/components/DefaultMask.vue'
import DefaultScrollToButton from '~/components/DefaultScrollToButton.vue'
import DefaultModal from '~/components/DefaultModal.vue'

import { dialogStore, authStore, giftStore } from '~/store'

@Component({
  components: {
    DefaultHeader,
    DefaultFooter,
    DefaultMask,
    DefaultScrollToButton,
    DefaultModal
  }
})
export default class DefaultLayout extends Vue {
  public timer: any = null

  get gifts() {
    return giftStore.notTakenOut
  }

  public modalState: boolean = false

  public handleModalClose() {
    dialogStore.setMaskActive(false)
    giftStore.setHasShowed(true)
    this.modalState = false
  }

  public async handleGetGift(serialno: string) {
    try {
      await this.sendClaimGiftRequest(serialno)
      giftStore.setHasShowed(true)
      dialogStore.setMaskActive(false)
      this.$router.push({
        name: 'announcements-serialno',
        params: { serialno }
      })
    } catch (e) {
      // error
    }
  }

  public async handleLogout() {
    try {
      this.$nuxt.$loading.start()
      await authStore.signOut({ token: this.$cookies.get('accessToken') })
    } catch (e) {
      // sign out error
    } finally {
      this.$nuxt.$loading.finish()
      this.$router.push('/account')
    }
  }

  get maskState() {
    return dialogStore.maskActive
  }

  get user() {
    return authStore.user !== null ? authStore.user.accountid : ''
  }

  get headerLogoUrl(): string {
    if (authStore.user !== null) {
      const mainGroupId = authStore.user.mainGroup
      return authStore.user.groups
        .filter((group: any) => group.groupid === mainGroupId)
        .reduce((prev: string, curr: any) => (prev += curr.profilelogo), '')
    }
    return ''
  }

  get menu() {
    return authStore.menu.length
      ? authStore.menu
          .filter(
            (item: any) =>
              item.moduleName &&
              item.moduleName !== '好好買' &&
              item.moduleName !== '我的禮物盒'
          )
          .map((item: any) => item.moduleName)
      : []
  }

  public async sendClaimGiftRequest(serialno: string) {
    const requestBody: ProxyRequestObject = {
      endpoint: '/api/GiftActivity/notTakenOuts',
      key: process.env.apiKey,
      data: { AnnouncementSerialNo: serialno },
      method: 'post',
      token: this.$cookies.get('accessToken')
    }
    try {
      const result: ResponseObject = await $axios.post('/api', requestBody)
      switch (Number(result.data.syscode)) {
        case 200:
          return result.data.data
        case 404:
          throw new Error('Failed to update status for this gift')
        default:
          return null
      }
    } catch (e) {
      throw new Error(`Backend Error: ${e}`)
    }
  }

  public async sendGetGiftRequest() {
    try {
      await giftStore.getNotTakenOut({
        token: this.$cookies.get('accessToken')
      })
    } catch (e) {
      //  error
    }
  }

  public async fetch() {
    try {
      await authStore.getMenu({ token: this.$cookies.get('accessToken') })
    } catch (e) {
      // error
    }
  }

  public async created() {
    try {
      await authStore.getMenu({ token: this.$cookies.get('accessToken') })
    } catch (e) {
      // error
    }
  }

  public mounted() {
    const validRoutes: Array<string> = [
      'announcements',
      'funevents',
      'joinclub',
      'questionnaires',
      'shoppingmall',
      'visitstore'
    ]
    const route: string = this.$route.name || ''
    if (!giftStore.hasShowed && validRoutes.includes(route)) {
      this.timer = setTimeout(async () => {
        await this.sendGetGiftRequest()
        if (this.gifts.length) {
          dialogStore.setMaskActive(true)
          this.modalState = true
        }
      }, 3000)
    }
  }

  public beforeDestroyed() {
    clearTimeout(this.timer)
  }
}
</script>
