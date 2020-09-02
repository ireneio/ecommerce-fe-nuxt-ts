<template>
  <b-container>
    <b-row>
      <b-col class="px-0">
        <div
          class="landingBody__section"
          v-for="item in pageData"
          :key="item.title"
        >
          <LandingPageSection
            v-if="item.title === 'announcementTag'"
            title="最新公告"
            :hasNew="hasUnreadAnnouncements"
            iconUrl="/img/icon_title_news.svg"
          >
            <div class="landingPageNews">
              <LandingPageNewsItem
                v-for="detail in item.data"
                :key="detail.serialno"
                :text="detail.content"
                :name="detail.creatorname"
                :date="new Date(detail.createdatetime).toLocaleString()"
                @click="handleGoToAnnouncements(detail.serialno)"
              />
            </div>
          </LandingPageSection>
          <client-only>
            <VueSlickCarousel
              v-bind="adsCarouselSetting"
              v-if="item.title === 'secondBanner'"
            >
              <div
                class="sectionAds__box"
                v-for="i in 10"
                :key="i"
                v-show="!secondBannerData.length"
              >
                <div class="sectionAds"></div>
              </div>
            </VueSlickCarousel>
          </client-only>
          <client-only>
            <VueSlickCarousel
              v-if="item.title === 'secondBanner'"
              v-bind="adsCarouselSetting"
            >
              <div
                class="sectionAds__box"
                v-for="item in secondBannerData"
                :key="item.serialno"
                v-show="secondBannerData.length"
              >
                <a
                  :href="item.url"
                  target="_blank"
                  class="sectionAds"
                  :style="{ 'background-image': `url(${item.image})` }"
                ></a>
              </div>
              <template #prevArrow>
                <div class="cardBox__arrowLeft"></div>
              </template>
              <template #nextArrow>
                <div class="cardBox__arrowRight"></div>
              </template>
            </VueSlickCarousel>
          </client-only>
        </div>

        <div
          class="landingBody__section"
          v-for="(tab, i) in tabData"
          :key="tab.serialno"
        >
          <LandingPageSection
            :title="tab.name"
            hasTabs
            iconUrl="/img/img-smile.svg"
            :linkUrl="tab.url ? tab.url : ''"
            @click="handleRedirect(tab)"
          >
            <template #tabs>
              <div class="landingPageTab">
                <VueSlickCarousel v-bind="tabCarouselSetting">
                  <div
                    class="landingPageTab__item"
                    v-for="(babyTab, j) in tab.tabList"
                    :key="babyTab.serialno"
                    @click="handleTabUpdate(i, j)"
                  >
                    {{ babyTab.name }}
                  </div>
                </VueSlickCarousel>
              </div>
            </template>
            <client-only>
              <VueSlickCarousel
                v-bind="cardCarouselSetting"
                v-if="!tabData.length"
              >
                <div class="cardBox" v-for="i in 15" :key="i">
                  <LandingPageCard hasNotif />
                </div>
                <template #prevArrow>
                  <div class="cardBox__arrowLeft"></div>
                </template>
                <template #nextArrow>
                  <div class="cardBox__arrowRight"></div>
                </template>
              </VueSlickCarousel>
            </client-only>
            <client-only>
              <VueSlickCarousel
                v-bind="cardCarouselSetting"
                v-show="isCurrentTab(i, babyTabIndex)"
                v-for="(babyTab, babyTabIndex) in tab.tabList"
                :key="babyTab.serialno"
              >
                <div
                  class="cardBox"
                  v-for="card in babyTab.tabProductList"
                  :key="card.serialno"
                >
                  <LandingPageCard
                    hasNotif
                    hasNotifIcon
                    :detail="{
                      name: card.name,
                      description: card.description,
                      url: card.url,
                      imageUrl: card.imageUrl
                    }"
                    @click="handleRedirect(card)"
                  />
                </div>
                <template #prevArrow>
                  <div class="cardBox__arrowLeft"></div>
                </template>
                <template #nextArrow>
                  <div class="cardBox__arrowRight"></div>
                </template>
              </VueSlickCarousel>
            </client-only>
          </LandingPageSection>
        </div>

        <div
          class="landingBody__section"
          v-for="theme in themeData"
          :key="theme.serialno"
        >
          <LandingPageSection
            :title="theme.name"
            :iconUrl="
              theme.name === 'Judodo揪多多'
                ? '/img/icon_jododo.svg'
                : theme.name === '電子票券'
                ? '/img/icon_title_coupon.svg'
                : '/img/img-smile.svg'
            "
            :linkUrl="theme.url ? theme.url : ''"
            @click="handleRedirect(theme)"
          >
            <client-only>
              <VueSlickCarousel
                v-bind="cardCarouselSetting"
                v-if="!themeData.length"
              >
                <div class="cardBox" v-for="i in 15" :key="i">
                  <LandingPageCard hasNotif />
                </div>
                <template #prevArrow>
                  <div class="cardBox__arrowLeft"></div>
                </template>
                <template #nextArrow>
                  <div class="cardBox__arrowRight"></div>
                </template>
              </VueSlickCarousel>
            </client-only>
            <client-only>
              <VueSlickCarousel v-bind="cardCarouselSetting">
                <div
                  class="cardBox"
                  v-for="card in theme.themeProductsList"
                  :key="card.serialno"
                >
                  <LandingPageCard
                    hasNotif
                    hasNotifIcon
                    :detail="{
                      name: card.name,
                      description: card.description,
                      url: card.url,
                      imageUrl: card.imageUrl
                    }"
                    @click="handleRedirect(card)"
                  />
                </div>
                <template #prevArrow>
                  <div class="cardBox__arrowLeft"></div>
                </template>
                <template #nextArrow>
                  <div class="cardBox__arrowRight"></div>
                </template>
              </VueSlickCarousel>
            </client-only>
          </LandingPageSection>
        </div>

        <div
          class="landingBody__section landingBody__section--last"
          v-for="ranking in rankingData"
          :key="ranking.serialno"
          :linkUrl="ranking.url ? ranking.url : ''"
        >
          <LandingPageSection
            :title="ranking.name"
            iconUrl="/img/img-smile.svg"
            @click="handleRedirect(ranking)"
          >
            <client-only>
              <VueSlickCarousel
                v-bind="cardCarouselSetting"
                v-if="!rankingData.length"
              >
                <div class="cardBox" v-for="i in 15" :key="i">
                  <LandingPageCard hasNotif />
                </div>
                <template #prevArrow>
                  <div class="cardBox__arrowLeft"></div>
                </template>
                <template #nextArrow>
                  <div class="cardBox__arrowRight"></div>
                </template>
              </VueSlickCarousel>
            </client-only>
            <client-only>
              <VueSlickCarousel v-bind="cardCarouselSetting">
                <div
                  class="cardBox"
                  v-for="card in ranking.rankingProductList"
                  :key="card.serialno"
                >
                  <LandingPageCard
                    hasNotifIcon
                    hasSubtitle
                    :detail="{
                      name: card.name,
                      description: card.description,
                      url: card.url,
                      imageUrl: card.imageUrl
                    }"
                    @click="handleRedirect(card)"
                  />
                </div>
                <template #prevArrow>
                  <div class="cardBox__arrowLeft"></div>
                </template>
                <template #nextArrow>
                  <div class="cardBox__arrowRight"></div>
                </template>
              </VueSlickCarousel>
            </client-only>
          </LandingPageSection>
        </div>

        <!-- 熱門午茶 Layout -->
        <!-- <div class="landingBody__section">
          <LandingPageSection
            title="熱門午茶"
            hasNew
            iconUrl="/img/icon_title_food.svg"
          >
            <div class="sectionTea">
              <div class="sectionTea__banner"></div>
              <div class="sectionTea__carousel">
                <VueSlickCarousel v-bind="sectionTeaCarouselSetting">
                  <div class="sectionTea__item" v-for="i in 15" :key="i">
                    <LandingPageStoreIcon
                      text="春陽茶事春陽茶事春陽茶事春陽茶事"
                      url=""
                    />
                  </div>
                  <div class="sectionTea__item" v-for="i in 15" :key="i">
                    <LandingPageStoreIcon text="aaa" url="" />
                  </div>
                </VueSlickCarousel>
              </div>
            </div>
          </LandingPageSection>
        </div> -->
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'nuxt-property-decorator'

import VueSlickCarousel from 'vue-slick-carousel'
import LandingPageSection from '~/components/LandingPageSection.vue'
import LandingPageCard from '~/components/LandingPageCard.vue'
import LandingPageStoreIcon from '~/components/LandingPageStoreIcon.vue'
import LandingPageNewsItem from '~/components/LandingPageNewsItem.vue'

import 'vue-slick-carousel/dist/vue-slick-carousel.css'
import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css'

import { landingStore, dialogStore } from '~/store'

@Component({
  layout: 'landing',
  middleware: 'auth',
  components: {
    VueSlickCarousel,
    LandingPageSection,
    LandingPageCard,
    LandingPageStoreIcon,
    LandingPageNewsItem
  }
})
export default class Index extends Vue {
  public sectionTeaCarouselSetting: any = {
    dots: false,
    edgeFriction: 0.35,
    infinite: false,
    speed: 500,
    slidesToShow: 7,
    slidesToScroll: 7,
    arrows: false,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 5
        }
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 5
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4
        }
      },
      {
        breakpoint: 390,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3
        }
      }
    ]
  }

  public cardCarouselSetting: any = {
    dots: false,
    edgeFriction: 0.35,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 5,
    arrows: true,
    responsive: [
      {
        breakpoint: 1366,
        settings: {
          arrows: true
        }
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
          arrows: false
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          arrows: false
        }
      },
      {
        breakpoint: 450,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          arrows: false
        }
      }
    ]
  }

  public adsCarouselSetting: any = {
    edgeFriction: 0.35,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false
  }

  public tabCarouselSetting: any = {
    dots: false,
    edgeFriction: 0.35,
    infinite: false,
    speed: 500,
    slidesToShow: 10,
    slidesToScroll: 10,
    arrows: false,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 7,
          slidesToScroll: 7
        }
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 5
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 5
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4
        }
      },
      {
        breakpoint: 390,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3
        }
      }
    ]
  }

  get pageData() {
    return landingStore.landingData
  }

  get secondBannerData() {
    if (landingStore.landingData) {
      const data: any = landingStore.landingData.find(
        (item: any) => item.title === 'secondBanner'
      )
      if (data) {
        const arr = [...data.data]
        arr.sort((a: any, b: any) => a.displayOrder - b.displayOrder)
        return arr.map((item: any) => ({
          url: item.url,
          serialno: item.serialno,
          image: item.webImageUrl
        }))
      }
      return []
    }
    return []
  }

  get tabData() {
    if (landingStore.landingData) {
      const data: any = landingStore.landingData.find(
        (item: any) => item.title === 'tab'
      )
      if (data) {
        const arr = [...data.data]
        arr.sort((a: any, b: any) => a.displayOrder - b.displayOrder)
        return arr.map((item: any) => ({
          ...item,
          tabList: [...item.tabListInfoList].sort(
            (a: any, b: any) => a.displayOrder - b.displayOrder
          )
        }))
      }
      return []
    }
    return []
  }

  get themeData() {
    if (landingStore.landingData) {
      const data: any = landingStore.landingData.find(
        (item: any) => item.title === 'theme'
      )
      if (data) {
        const arr = [...data.data]
        arr.sort((a: any, b: any) => a.displayOrder - b.displayOrder)
        return arr.map((item: any) => ({
          ...item,
          themeProductsList: [...item.themeProductsList].sort(
            (a: any, b: any) => a.displayOrder - b.displayOrder
          )
        }))
      }
      return []
    }
    return []
  }

  get rankingData() {
    if (landingStore.landingData) {
      const data: any = landingStore.landingData.find(
        (item: any) => item.title === 'ranking'
      )
      if (data) {
        const arr = [...data.data]
        arr.sort((a: any, b: any) => a.displayOrder - b.displayOrder)
        return arr.map((item: any) => ({
          ...item,
          rankingProductList: [...item.rankingProductList].sort(
            (a: any, b: any) => a.displayOrder - b.displayOrder
          )
        }))
      }
      return []
    }
    return []
  }

  get hasUnreadAnnouncements() {
    const announcementTab: any = this.pageData.find(
      (item: any) => item.title === 'announcementTag'
    )
    return (
      announcementTab.data.findIndex((item: any) => item.isread === false) > -1
    )
  }

  @Watch('initialized', { immediate: true, deep: true })
  onInitializedChanged() {
    if (this.pageData) {
      const data: any = landingStore.landingData.find(
        (item: any) => item.title === 'tab'
      )
      if (data) {
        const arr = [...data.data]
        this.currentTabofTabsData = arr.map(() => 0)
      }
    }
  }

  public currentTabofTabsData: Array<number> = []

  public initialized: boolean = false

  public handleTabUpdate(i: number, j: number): void {
    this.currentTabofTabsData = [
      ...this.currentTabofTabsData.slice(0, i),
      j,
      ...this.currentTabofTabsData.slice(i + 1)
    ]
  }

  public isCurrentTab(i: number, j: number): boolean {
    return this.currentTabofTabsData[i] === j
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
        message: redirectHintMessage,
        type: 'confirm',
        initializer: 'index-redirect'
      })
      dialogStore.setConfirmAction({ url })
    } else {
      location.href = url
    }
  }

  public handleGoToAnnouncements(serialno: string): void {
    this.$router.push({ name: 'announcements-serialno', params: { serialno } })
  }

  public async sendGetLandingRequest() {
    try {
      await landingStore.getLanding({ token: this.$cookies.get('accessToken') })
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
    await this.sendGetLandingRequest()
    this.initialized = true
  }

  public activated() {
    this.$nextTick(async () => {
      this.$nuxt.$loading.start()
      await this.sendGetLandingRequest()
      this.$nuxt.$loading.finish()
    })
  }
}
</script>
<style lang="scss" scoped>
@import '../assets/scss/utils/variables';
@import '../assets/scss/utils/media';

.landingBody {
  background-color: $whiteFour;

  &__section {
    margin-top: 32px;
    &--last {
      margin-bottom: 120px;
    }
  }
}
.sectionTea {
  display: flex;
  flex-wrap: wrap;
  &__item {
    @include grid-md {
      padding-left: $spacing-s;
      padding-right: $spacing-s;
    }
  }
  &__banner {
    flex: 0 0 100%;
    @include grid-md {
      flex: 0 0 40%;
    }
    height: 100px;
    border-radius: 5px;
    background-color: $primary;
  }
  &__carousel {
    flex: 0 0 auto;
    max-width: 100%;
    margin-top: $spacing-m;
    @include grid-md {
      flex: 0 0 60%;
      padding-left: $spacing-s;
      max-width: 60%;
      margin-top: 0;
    }
  }
}
.sectionAds {
  display: block;
  height: 120px;
  min-width: 300px;
  @include grid-lg {
    height: 217px;
  }
  background-color: $primary;
  background-image: url(/img/image.png);
  background-position: center center;
  background-size: cover;
  &__box {
    width: 100%;
    padding-left: 0;
    padding-right: 0;
  }
}
.cardBox {
  padding: 0 $spacing-xs;
  max-width: 100%;
  @include grid-md {
    padding: 0 $spacing-s;
  }
  &__arrowLeft {
    left: -17px;
    background: url(/img/icon_lwft.svg);
    &:hover {
      background: url(/img/icon_lwft.svg);
    }
    &:before {
      content: '';
    }
  }
  &__arrowRight {
    right: -17px;
    background: url(/img/icon_right.svg);
    &:hover {
      background: url(/img/icon_right.svg);
    }
    &:before {
      content: '';
    }
  }
  &__arrowLeft,
  &__arrowRight {
    z-index: 10;
    width: 24px;
    height: 36px;
    background-position: center center;
    background-repeat: no-repeat;
    background-size: cover;
  }
}

.landingPageTab {
  max-width: 100%;
  width: 100%;
  height: 50px;
  text-align: center;
  color: $greySix;
  font-size: $fz-s;
  &__item {
    cursor: pointer;
    position: relative;
    top: 15px;
    height: 40px;
    border-right: 1px solid $whiteFour;
  }
}

.landingPageNews {
  margin-top: -$spacing-m;
  margin-bottom: -$spacing-m;
}
</style>
