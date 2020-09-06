<template>
  <div>
    <visit-store-container>
      <div class="couponDetail__wrapper">
        <div class="couponDetail">
          <div class="couponDetail__carousel">
            <client-only>
              <vue-slick-carousel v-bind="carouselSetting">
                <div
                  class="couponDetail__carouselImg"
                  v-for="img in carouselImages"
                  :key="img.id"
                  :style="{ 'background-image': `url(${img.imageUrl})` }"
                ></div>
                <div v-if="!carouselImages.length">Placeholder Image</div>
                <template #prevArrow>
                  <div class="carouselArrowLeft"></div>
                </template>
                <template #nextArrow>
                  <div class="carouselArrowRight"></div>
                </template>
              </vue-slick-carousel>
            </client-only>
          </div>
          <div class="couponDetailDescBox">
            <h3 class="couponDetailDescBox__title">{{ couponDetail.couponName }}</h3>
            <p class="couponDetailDescBox__subtitle">{{ couponDetail.description }}</p>
            <div class="couponDetailDescBox__ratingBox">
              <div class="couponDetailRating">
                <span class="couponDetailRating__num">{{ couponDetail.aveScore }}</span>
                <div class="couponDetailRating__stars">
                  <fa
                    class="couponDetail__stars"
                    :icon="[i === 0 ? 'far' : 'fas', 'star']"
                    v-for="(i, index) in starCount"
                    :key="index"
                  ></fa>
                </div>
                <span class="couponDetailRating__count">{{ couponDetail.scoreTimes }} reviews</span>
              </div>
              <div class="couponDetailDescBox__myRating">
                <span class="couponDetailDescBox__myRatingText">評分</span>
                <div class="couponDetailDescBox__myRatingStars">
                  <div
                    @mouseleave="starsHovered = 0"
                    @click="handleSubmitRating"
                    v-if="couponDetail.myScore === 0"
                  >
                    <fa
                      class="couponDetail__stars"
                      :icon="[starsHovered > 0 ? 'fas' : 'far', 'star']"
                      @mouseover="handleMouseoverRating(1)"
                    ></fa>
                    <fa
                      class="couponDetail__stars"
                      :icon="[starsHovered > 1 ? 'fas' : 'far', 'star']"
                      @mouseover="handleMouseoverRating(2)"
                    ></fa>
                    <fa
                      class="couponDetail__stars"
                      :icon="[starsHovered > 2 ? 'fas' : 'far', 'star']"
                      @mouseover="handleMouseoverRating(3)"
                    ></fa>
                    <fa
                      class="couponDetail__stars"
                      :icon="[starsHovered > 3 ? 'fas' : 'far', 'star']"
                      @mouseover="handleMouseoverRating(4)"
                    ></fa>
                    <fa
                      class="couponDetail__stars"
                      :icon="[starsHovered > 4 ? 'fas' : 'far', 'star']"
                      @mouseover="handleMouseoverRating(5)"
                    ></fa>
                  </div>
                  <div style="cursor: not-allowed;" v-if="couponDetail.myScore > 0">
                    <fa
                      class="couponDetail__stars"
                      :icon="[i === 0 ? 'far' : 'fas', 'star']"
                      v-for="(i, index) in myStarCount"
                      :key="index"
                    ></fa>
                  </div>
                </div>
              </div>
            </div>
            <div class="couponDetailDescBox__priceBox">
              <div class="couponDetailDescBox__ogPrice">原價${{ couponDetail.originalPrice }}</div>
              <div class="couponDetailDescBox__newPrice">${{ couponDetail.salePrice }}</div>
            </div>
            <div class="couponDetailDescBox__date">
              <span class="couponDetailDescBox__dateIcon"></span>
              <span class="couponDetailDescBox__dateText">
                {{
                couponDetail.lastUseTimeDisplay
                }}
              </span>
            </div>
            <div class="couponDetailDescBox__btn">
              <base-button type="primary" display="block" @click="handlePurchase">立即購買</base-button>
            </div>
          </div>
        </div>
        <div class="couponDetail__desc">
          <section class="couponDetailSection">
            <h5 class="couponDetailSection__title">票券基本資訊</h5>
            <article class="couponDetailSection__content">{{ couponDetail.description }}</article>
          </section>
          <section class="couponDetailSection">
            <h5 class="couponDetailSection__title">票券兌換規則</h5>
            <article class="couponDetailSection__content">{{ couponDetail.rule }}</article>
          </section>
          <section class="couponDetailSection">
            <h5 class="couponDetailSection__title">適用分店</h5>
            <article class="couponDetailSection__content">{{ couponDetail.note }}</article>
          </section>
        </div>
      </div>
    </visit-store-container>
    <default-dialog
      :active="dialogState"
      @cancel="handleDialogClose"
      @accept="handleDialogClose"
      @confirm="handleDialogConfirm"
      :message="dialogContent.message"
      :title="dialogContent.title"
      :type="dialogContent.type"
      :icon="dialogContent.icon"
    ></default-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import VueSlickCarousel from 'vue-slick-carousel'
import { ProxyRequestObject, ResponseObject } from 'Http'
import { $axios } from '~/utils/api'
import VisitStoreContainer from '~/components/VisitStoreContainer.vue'
import BaseButton from '~/components/BaseButton.vue'
import DefaultDialog from '~/components/DefaultDialog.vue'
import { visitStore, commonStore, dialogStore } from '~/store'

@Component({
  layout: 'default',
  middleware: 'auth',
  components: {
    VisitStoreContainer,
    BaseButton,
    DefaultDialog,
    VueSlickCarousel
  }
})
export default class ShoppingMallDetail extends Vue {
  public handlePurchase() {
    this.$router.push({
      name: 'shoppingmall-serialno-purchase',
      params: { serialno: this.$route.params.serialno }
    })
  }

  get dialogState() {
    return dialogStore.active
  }

  get dialogContent() {
    return dialogStore.content
  }

  public async handleDialogConfirm() {
    this.$nuxt.$loading.start()
    const { stars } = dialogStore.confirmAction
    try {
      await this.sendSubmitRatingRequest(stars)
      await this.sendGetCouponDetailRequest()
      dialogStore.setConfirmed(true)
      dialogStore.setActive(false)
      dialogStore.setMaskActive(false)
    } catch (e) {
      // error
      dialogStore.setContent({
        title: '此票券已經評分',
        type: 'accept',
        icon: true,
        initializer: 'shoppingmall-rating-error'
      })
      dialogStore.setActive(true)
      dialogStore.setMaskActive(true)
    } finally {
      this.$nuxt.$loading.finish()
    }
  }

  public handleDialogClose() {
    dialogStore.setActive(false)
    dialogStore.setMaskActive(false)
  }

  public carouselSetting: any = {
    dots: false,
    edgeFriction: 0.35,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true
  }

  get carouselImages() {
    return this.couponDetail.couponImages
      ? this.couponDetail.couponImages.map((item: any, index: number) => ({
          ...item,
          id: index
        }))
      : []
  }

  get starCount() {
    const count = this.couponDetail.aveScore
    const arr: Array<number> = []
    for (let i = 1; i <= 5; i++) {
      arr.push(i <= count ? 1 : 0)
    }
    return arr
  }

  get myStarCount() {
    const count = this.couponDetail.myScore
    const arr: Array<number> = []
    for (let i = 1; i <= 5; i++) {
      arr.push(i <= count ? 1 : 0)
    }
    return arr
  }

  public handleMouseoverRating(order: number) {
    this.starsHovered = order
  }

  public starsHovered: number = 0

  public handleSubmitRating() {
    const stars = this.starsHovered
    dialogStore.setActive(true)
    dialogStore.setMaskActive(true)
    if (this.couponDetail.myScore <= 0) {
      dialogStore.setContent({
        title: '確定送出評分？',
        message: `已將票券評為 ${stars} 顆星，點選確定後將無法再更改喔`,
        type: 'confirm',
        icon: true,
        initializer: 'shoppingmall-rating'
      })
      dialogStore.setConfirmAction({ stars })
    }
  }

  get couponDetail() {
    return visitStore.couponDetail
  }

  public async sendGetCouponDetailRequest() {
    try {
      await visitStore.getCouponDetail({
        token: this.$cookies.get('accessToken'),
        serialno: this.$route.params.serialno
      })
    } catch (e) {
      // error
      throw new Error(e)
    }
  }

  public async sendSubmitRatingRequest(score: number): Promise<any> {
    const requestBody: ProxyRequestObject = {
      endpoint: '/api/Store/Score',
      key: process.env.apiKey,
      data: {
        storeId: this.$route.params.storeId,
        score,
        ticketId: this.$route.params.serialno
      },
      method: 'post',
      token: this.$cookies.get('accessToken')
    }
    try {
      const result: ResponseObject = await $axios.post('/api', requestBody)
      switch (Number(result.data.syscode)) {
        case 200:
          return result.data.data
        case 404:
        case 400:
          throw new Error('Store is already rated')
        default:
          return new Error('Error rating the store')
      }
    } catch (e) {
      throw new Error(`Backend Error: ${e}`)
    }
  }

  public async fetch() {
    try {
      await this.sendGetCouponDetailRequest()
    } catch (e) {
      dialogStore.setActive(true)
      dialogStore.setMaskActive(true)
      dialogStore.setContent({
        title: '資料加載錯誤，請刷新再試。',
        icon: true,
        type: 'accept'
      })
    }
  }

  public activated() {
    this.$nextTick(async () => {
      try {
        this.$nuxt.$loading.start()
        await this.sendGetCouponDetailRequest()
      } catch (e) {
        dialogStore.setActive(true)
        dialogStore.setMaskActive(true)
        dialogStore.setContent({
          title: '資料加載錯誤，請刷新再試。',
          icon: true,
          type: 'accept'
        })
      } finally {
        this.$nuxt.$loading.finish()
      }
    })
  }
}
</script>
<style lang="scss" scoped>
@import '../../../assets/scss/utils/variables';
@import '../../../assets/scss/utils/media';
@import '../../../assets/scss/utils/helpers';

.couponDetail {
  display: flex;
  flex-wrap: wrap;
  &__carousel {
    flex: 0 0 100%;
    height: 410px;
    max-width: 100%;
    @include grid-md {
      flex: 0 0 60%;
      max-width: 60%;
      padding-right: $spacing-xl;
    }
  }
  &__carouselImg {
    background-position: center center;
    background-size: contain;
    background-repeat: no-repeat;
    max-width: 100%;
    height: 410px;
  }
  &__stars {
    margin: 0 $spacing-xs;
  }
  &__desc {
    @include grid-md {
      max-width: 50%;
    }
  }
  &__wrapper {
    padding: $spacing-xxl;
  }
}
.couponDetailDescBox {
  position: sticky;
  top: 0;
  flex: 0 0 100%;
  border-radius: 4px;
  padding: 30px $spacing-l 50px;
  border: 1px solid $whiteOne;
  box-shadow: 4px 4px 10px 0 rgba(0, 0, 0, 0.1);
  margin-top: $spacing-xl;
  @include grid-md {
    flex: 0 0 40%;
    margin-top: 0;
  }
  &__title {
    color: $greyThree;
    font-size: $fz-l;
    font-weight: bold;
    margin-bottom: $spacing-m;
    @include cutLine(2);
  }
  &__subtitle {
    color: $greyTwo;
    font-size: $fz-m;
    font-weight: bold;
    margin-bottom: $spacing-xxl;
    @include cutLine(2);
  }
  &__myRating {
    display: flex;
    align-items: center;
    margin-top: $spacing-m;
  }
  &__myRatingText {
    margin-right: $spacing-s;
    font-size: $fz-s;
    color: $greyThree;
  }
  &__myRatingStars {
    color: $primary;
    font-size: $fz-l;
    cursor: pointer;
  }
  &__priceBox {
    text-align: right;
  }
  &__ogPrice {
    color: $greyTwo;
    text-decoration: line-through;
    font-size: $fz-xxl;
  }
  &__newPrice {
    color: $primary;
    font-size: 42px;
    font-weight: bold;
  }
  &__date {
    margin-bottom: $spacing-xxl;
    font-size: 0;
  }
  &__dateIcon {
    display: inline-block;
    width: 10px;
    height: 10px;
    background-color: $primary;
    margin-right: $spacing-s;
    font-size: $fz-s;
  }
  &__dateText {
    font-size: $fz-s;
    color: $greyThree;
  }
}

.couponDetailRating {
  display: flex;
  align-items: center;
  &__num {
    font-size: $fz-s;
    color: $greyThree;
    margin-right: $spacing-s;
  }
  &__stars {
    font-size: $fz-s;
    margin-right: $spacing-s;
    color: $primary;
  }
  &__count {
    color: $whiteOne;
    font-size: $fz-s;
  }
}

.couponDetailSection {
  margin-top: $spacing-m;
  &__title {
    color: $greyThree;
    font-weight: bold;
    font-size: $fz-m;
    padding-bottom: $spacing-m;
    border-bottom: 1px solid $primary;
  }
  &__content {
    font-size: $fz-s;
    padding: $spacing-m 0;
  }
}
</style>
