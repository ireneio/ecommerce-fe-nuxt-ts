<template>
  <DefaultMainContainer
    title="返回訊息牆"
    dark
    :clickableTitle="true"
    route="announcements"
  >
    <div class="announcementsDetail">
      <div class="announcementsDetail__titlebar">
        <h3 class="announcementsDetail__title">{{ detailData.title }}</h3>
        <div class="announcementsDetail__date">
          {{ detailData.date.split(' ')[0] }}
        </div>
      </div>
      <div class="announcementsDetail__content">
        <p v-html="detailData.content"></p>
      </div>
    </div>
  </DefaultMainContainer>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import DefaultMainContainer from '~/components/DefaultMainContainer.vue'
import { announcementsStore } from '~/store'

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
  get detailData(): AnnouncementsDetailProps {
    const { title, announceDate, content } = announcementsStore.adDetail
    return {
      title,
      date: new Date(announceDate).toLocaleString(),
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
      this.$router.push('/')
    } finally {
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
