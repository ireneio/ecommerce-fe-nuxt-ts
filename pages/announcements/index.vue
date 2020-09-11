<template>
  <div>
    <default-main-container title="訊息牆" dark>
      <div class="announcements">
        <div class="announcements__tabbar">
          <span
            class="announcements__tab"
            :class="{ 'announcements__tab--active': currentTab === 0 }"
            @click="currentTab = 0"
            >最新消息</span
          >
          <span
            class="announcements__tab"
            :class="{ 'announcements__tab--active': currentTab === 1 }"
            @click="currentTab = 1"
            >個人通知</span
          >
        </div>
        <div class="announcements__content">
          <questionnaires-card
            v-for="item in latestNewsCardData"
            :key="item.id"
            class="mb-5"
            hasPic
            type="announcements"
            :value="item"
            v-show="currentTab === 0"
            @click="
              $router.push({
                name: 'announcements-serialno',
                params: { serialno: item.serialno }
              })
            "
          />
          <questionnaires-card
            v-for="item in personalNewsCardData"
            :key="item.id"
            class="mb-5"
            hasPic
            type="announcements"
            :value="item"
            v-show="currentTab === 1"
            @click="
              $router.push({
                name: 'announcements-serialno',
                params: { serialno: item.serialno }
              })
            "
          />
        </div>
        <div class="announcements__paging" v-if="currentTab === 0">
          <div
            class="announcements__page"
            @click="handlePageUpdateTab0(-1)"
            v-show="pageTab0 > 1"
          >
            上一頁
          </div>
          <div
            class="announcements__page"
            v-for="i in latestNewsPages"
            v-show="i === pageTab0 || i === pageTab0 - 1 || i === pageTab0 + 1"
            :key="i"
            @click="handlePageUpdateTab0ViaNumber(i)"
          >
            <span>{{ i }}</span>
            <span>.</span>
          </div>
          <div
            class="announcements__page"
            @click="handlePageUpdateTab0(1)"
            v-show="pageTab0 < latestNewsPages"
          >
            下一頁
          </div>
        </div>
        <div class="announcements__paging" v-if="currentTab === 1">
          <div
            class="announcements__page"
            @click="handlePageUpdateTab1(-1)"
            v-show="pageTab1 > 1"
          >
            上一頁
          </div>
          <div
            class="announcements__page"
            v-for="i in personalNewsPages"
            v-show="i === pageTab1 || i === pageTab1 - 1 || i === pageTab1 + 1"
            :key="i"
            @click="handlePageUpdateTab1ViaNumber(i)"
          >
            <span>{{ i }}</span>
            <span>.</span>
          </div>
          <div
            class="announcements__page"
            @click="handlePageUpdateTab1(1)"
            v-show="pageTab1 < personalNewsPages"
          >
            下一頁
          </div>
        </div>
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
import { Component, Vue } from 'nuxt-property-decorator'
import DefaultMainContainer from '~/components/DefaultMainContainer.vue'
import DefaultDialog from '~/components/DefaultDialog.vue'
import QuestionnairesCard from '~/components/QuestionnairesCard.vue'
import { announcementsStore, dialogStore } from '~/store'

@Component({
  middleware: 'auth',
  components: {
    DefaultMainContainer,
    DefaultDialog,
    QuestionnairesCard
  }
})
export default class AnnouncementsIndex extends Vue {
  get dialogState() {
    return dialogStore.active
  }

  get dialogContent() {
    return dialogStore.content
  }

  private handleDialogClose() {
    dialogStore.setActive(false)
    dialogStore.setMaskActive(false)
  }

  private currentTab: 0 | 1 = 0

  private pageTab0: number = 1

  private pageTab1: number = 1

  private handlePageUpdateTab0(val: number) {
    this.$nuxt.$loading.start()
    if (
      (this.pageTab0 === 1 && val === -1) ||
      (val === 1 && this.pageTab0 >= this.latestNewsPages)
    ) {
      this.$nuxt.$loading.finish()
      return
    } else if (val > 1 && val <= this.latestNewsPages) {
      this.pageTab0 = val
    } else {
      this.pageTab0 += val
    }
    const timeout = setTimeout(() => {
      this.$nuxt.$loading.finish()
      clearTimeout(timeout)
    }, 500)
  }

  private handlePageUpdateTab1(val: number) {
    this.$nuxt.$loading.start()
    if (
      (this.pageTab1 === 1 && val === -1) ||
      (val === 1 && this.pageTab1 >= this.latestNewsPages)
    ) {
      this.$nuxt.$loading.finish()
      return
    } else if (val > 1 && val <= this.latestNewsPages) {
      this.pageTab1 = val
    } else {
      this.pageTab1 += val
    }
    setTimeout(() => {
      this.$nuxt.$loading.finish()
    }, 500)
  }

  private handlePageUpdateTab0ViaNumber(val: number) {
    this.$nuxt.$loading.start()
    this.pageTab0 = val
    const timeout = setTimeout(() => {
      this.$nuxt.$loading.finish()
      clearTimeout(timeout)
    }, 500)
  }

  private handlePageUpdateTab1ViaNumber(val: number) {
    this.$nuxt.$loading.start()
    this.pageTab1 = val
    const timeout = setTimeout(() => {
      this.$nuxt.$loading.finish()
      clearTimeout(timeout)
    }, 500)
  }

  get latestNews() {
    return announcementsStore.ads.length
      ? announcementsStore.ads
          .filter((item: any) => item.sendtype === 0)
          .map((item: any) => ({
            ...item,
            annouceDate: new Date(item.announceDate).toLocaleString()
          }))
          .slice((this.pageTab0 - 1) * 10, (this.pageTab0 - 1) * 10 + 10 - 1)
      : []
  }

  get latestNewsPages() {
    return announcementsStore.ads.length
      ? Math.ceil(
          announcementsStore.ads.filter((item: any) => item.sendtype === 0)
            .length / 10
        )
      : 0
  }

  get personalNews() {
    return announcementsStore.ads.length
      ? announcementsStore.ads
          .filter((item: any) => item.sendtype === 1)
          .map((item: any) => ({
            ...item,
            announceDate: new Date(item.announceDate).toLocaleString()
          }))
          .slice((this.pageTab1 - 1) * 10, this.pageTab1 + 10 - 1)
      : []
  }

  get personalNewsPages() {
    return announcementsStore.ads.length
      ? Math.ceil(
          announcementsStore.ads.filter((item: any) => item.sendtype === 1)
            .length / 10
        )
      : []
  }

  get latestNewsPagination(): Array<number> {
    let res: Array<number> = []
    for (let i = 1; i <= this.latestNewsPages; i++) {
      res = [...res, i]
    }
    return res
  }

  get personalNewsPagination(): Array<number> {
    let res: Array<number> = []
    for (let i = 1; i <= this.personalNewsPages; i++) {
      res = [...res, i]
    }
    return res
  }

  get latestNewsCardData() {
    return this.latestNews.map((item: any) => ({
      status: item.isRead ? 0 : 2,
      date: item.annouceDate,
      title: item.title,
      serialno: item.id,
      isPinned: item.isPinned
    }))
  }

  get personalNewsCardData() {
    return this.personalNews.map((item: any) => ({
      status: item.isRead ? 0 : 2,
      date: item.annouceDate,
      title: item.title,
      serialno: item.id,
      isPinned: item.isPinned
    }))
  }

  private async sendGetAnnouncementsRequest() {
    try {
      await announcementsStore.getAds({
        token: this.$cookies.get('accessToken')
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

  private async fetch() {
    await this.sendGetAnnouncementsRequest()
  }

  private activated() {
    this.$nextTick(async () => {
      this.$nuxt.$loading.start()
      await this.sendGetAnnouncementsRequest()
      this.$nuxt.$loading.finish()
    })
  }
}
</script>
<style lang="scss" scoped>
@import '../../assets/scss/utils/variables';
@import '../../assets/scss/utils/media';

.announcements {
  position: relative;
  &__tabbar {
    position: absolute;
    right: 4px;
    top: -56px;
    display: flex;
    justify-content: space-between;
    width: 180px;
  }
  &__tab {
    cursor: pointer;
    font-size: $fz-s;
    color: #fff;
    background-color: $greyTen;
    padding: 2px $spacing-m;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    &--active {
      background-color: $primary;
    }
  }
  &__paging {
    display: flex;
    align-items: flex-end;
    justify-content: center;
    width: 100%;
    @include grid-md {
      justify-content: flex-end;
    }
  }
  &__page {
    font-size: $fz-m;
    color: $greyThree;
    cursor: pointer;
    padding: $spacing-m;
    font-weight: bold;
  }
}
</style>
