<template>
  <div>
    <default-main-container
      title="返回訊息牆"
      dark
      :clickableTitle="true"
      route="announcements"
    >
      <div class="announcementsDetail">
        <div class="announcementsDetail__titlebar">
          <h3 class="announcementsDetail__title">{{ detailData.title }}</h3>
          <div class="announcementsDetail__date">
            {{ detailData.date }}
          </div>
        </div>
        <section class="announcementsDetail__content">
          <div v-html="detailData.content"></div>
        </section>
      </div>
    </default-main-container>
    <client-only>
      <default-dialog
        :active="dialogState"
        @accept="handleDialogClose"
        :message="dialogContent.message"
        :title="dialogContent.title"
        :type="dialogContent.type"
        :icon="dialogContent.icon"
      ></default-dialog>
    </client-only>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import DefaultMainContainer from '~/components/DefaultMainContainer.vue'
import { announcementsStore, dialogStore } from '~/store'

interface AnnouncementsDetailProps {
  title: number
  date: string
  content: string
}

@Component({
  middleware: 'auth',
  components: {
    DefaultMainContainer
  }
})
export default class AnnouncementsDetail extends Vue {
  get dialogState() {
    return dialogStore.active
  }

  get dialogContent() {
    return dialogStore.content
  }

  public handleDialogClose() {
    dialogStore.setActive(false)
    dialogStore.setMaskActive(false)
  }

  get detailData(): AnnouncementsDetailProps {
    const { title, announceDate, content } = announcementsStore.adDetail
    return {
      title,
      date: new Date(announceDate).toLocaleString('zh-tw', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
      }),
      content
    }
  }

  public async sendGetAnnouncementDetailRequest() {
    try {
      await announcementsStore.getAdDetail({
        token: this.$cookies.get('accessToken'),
        serialno: this.$route.params.serialno
      })
    } catch (e) {
      // error
      dialogStore.setActive(true)
      dialogStore.setMaskActive(true)
      dialogStore.setContent({
        title: '資料加載錯誤，請刷新再試。',
        icon: true,
        type: 'accept'
      })
    }
  }

  public async fetch() {
    await this.sendGetAnnouncementDetailRequest()
  }

  public activated() {
    this.$nextTick(async () => {
      this.$nuxt.$loading.start()
      await this.sendGetAnnouncementDetailRequest()
      this.$nuxt.$loading.finish()
    })
  }

  public beforeResolve(to: any, from: any, next: Function) {
    if (to.route.params.serialno === '') next({ name: 'announcements' })
    next()
  }
}
</script>
<style lang="scss" scoped>
@import '../../assets/scss/utils/variables';

.announcementsDetail {
  &__titlebar {
    display: flex;
    justify-content: space-between;
    padding: 0 $spacing-m $spacing-l $spacing-m;
    border-bottom: 1px solid $greyThree;
  }
  &__title {
    font-size: $fz-xxl;
    color: $greyThree;
    font-weight: bold;
  }
  &__content,
  &__date {
    font-size: $fz-s;
    color: $greyThree;
  }
  &__content {
    padding: $spacing-l $spacing-m $spacing-l $spacing-m;
  }
}
</style>
