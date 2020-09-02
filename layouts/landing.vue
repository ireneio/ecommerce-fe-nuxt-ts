<template>
  <div>
    <LandingHeader />
    <b-container fluid="xl">
      <b-row>
        <b-col>
          <div class="landingBanner">
            <LandingPageBanner :items="bannerImages" />
          </div>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <LandingPageAppCarousel
            :icons="appCarouselIcons"
            @click="handleRedirect"
          />
        </b-col>
      </b-row>
    </b-container>
    <main class="landingBody">
      <b-container>
        <b-row>
          <b-col class="px-0">
            <Nuxt />
          </b-col>
        </b-row>
      </b-container>
    </main>
    <LandingFooter />
    <DefaultDialog
      :active="dialogState"
      @confirm="handleDialogConfirm"
      @cancel="handleDialogClose"
      @accept="handleDialogClose"
      :message="dialogContent.message"
      :title="dialogContent.title"
      :type="dialogContent.type"
      :icon="dialogContent.icon"
    ></DefaultDialog>
    <DefaultMask :active="maskState" />
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import LandingHeader from '~/components/LandingHeader.vue'
import LandingFooter from '~/components/LandingFooter.vue'
import LandingPageAppCarousel from '~/components/LandingPageAppCarousel.vue'
import LandingPageBanner from '~/components/LandingPageBanner.vue'
import DefaultDialog from '~/components/DefaultDialog.vue'

import { landingStore, dialogStore } from '~/store'

@Component({
  components: {
    DefaultDialog,
    LandingHeader,
    LandingFooter,
    LandingPageAppCarousel,
    LandingPageBanner
  }
})
export default class LandingLayout extends Vue {
  get pageData() {
    return landingStore.landingData
  }

  get appCarouselIcons() {
    if (landingStore.landingData) {
      const data: any = landingStore.landingData.find(
        (item: any) => item.title === 'hotStore'
      )
      if (data) {
        return data.data.map((item: any) => ({
          url: item.url,
          text: item.slogan || item.name,
          icon: item.webImageUrl,
          redirectHintMessage: item.redirectHintMessage,
          isDisplayHintMessage: item.isDisplayHintMessage
        }))
      }
      return []
    }
    return []
  }

  get bannerImages() {
    if (landingStore.landingData) {
      const data: any = landingStore.landingData.find(
        (item: any) => item.title === 'banner'
      )
      if (data) {
        const arr = [...data.data]
        const sortOrder = arr.sort(
          (a: any, b: any) => a.displayOrder - b.displayOrder
        )
        return sortOrder.map((item: any) => ({
          url: item.url,
          serialno: item.serialno,
          image: item.webImageUrl
        }))
      }
      return []
    }
    return []
  }

  get maskState() {
    return dialogStore.maskActive
  }

  get dialogState() {
    return dialogStore.active
  }

  get dialogContent() {
    return dialogStore.content
  }

  public handleDialogConfirm() {
    dialogStore.setConfirmed(true)
    dialogStore.setActive(false)
    dialogStore.setMaskActive(false)
    const { url } = dialogStore.confirmAction
    location.href = url
  }

  public handleDialogClose() {
    dialogStore.setActive(false)
    dialogStore.setMaskActive(false)
  }

  public handleRedirect({
    isDisplayHintMessage,
    redirectHintMessage,
    url
  }: any) {
    if (isDisplayHintMessage) {
      dialogStore.setActive(true)
      dialogStore.setMaskActive(true)
      dialogStore.setContent({
        title: '您即將前往第三方合作網站，是否繼續？',
        message: redirectHintMessage
      })
      dialogStore.setConfirmAction({ url })
    } else {
      location.href = url
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/utils/variables';

.landingBody {
  background-color: $whiteFour;
}
.landingBanner {
  margin-top: 52px;
}
</style>
