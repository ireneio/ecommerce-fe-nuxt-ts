<template>
  <div>
    <visit-store-container>
      <main class="visitstoredetail">
        <b-container>
          <b-row>
            <b-col cols="24" lg="12">
              <div class="visitstoredetailimgbox">
                <div
                  class="visitstoredetailimgbox__img"
                  :style="{ 'background-image': `url(${storeData.logoUrl})` }"
                ></div>
                <div class="visitstoredetailimgbox__desc">
                  <span>
                    {{
                      storeData.description !== ''
                        ? storeData.description
                        : '無圖片說明...'
                    }}
                  </span>
                </div>
              </div>
            </b-col>
            <b-col cols="24" lg="12">
              <div class="visitstoredetailtitlebox">
                <div class="visitstoredetailtitlebox__img">
                  <img
                    :src="
                      storeData.imageUrl !== ''
                        ? storeData.imageUrl
                        : 'https://hnstayfuntst.blob.core.windows.net/store/Storelogo.png'
                    "
                    alt
                  />
                </div>
                <div class="visitstoredetailtitlebox__desc">
                  <h3 class="visitstoredetailtitlebox__title">
                    {{ storeData.storeName }}
                  </h3>
                  <p class="visitstoredetailtitlebox__subtitle">
                    {{ storeData.description }}
                  </p>
                </div>
              </div>
              <div class="visitstoredetaildescription">
                <div class="visitstoredetaildescription__badge">優惠</div>
                <article class="visitstoredetaildescription__badgedesc">
                  <p v-for="(item, index) in storeSpecialReformat" :key="index">
                    {{ item }}
                  </p>
                </article>
              </div>
              <div class="visitstoredetailbuttonbox">
                <base-button type="primary" @click="handleDownloadApp">
                  下載APP享優惠
                </base-button>
              </div>
            </b-col>
            <b-col cols="24" class="mt-4 mt-lg-0">
              <div class="visitstoredetailborder"></div>
            </b-col>
            <b-col cols="24" lg="8">
              <div class="visitstoredetaildetails">
                <div class="visitstoredetaildetails__wrapper">
                  <div class="visitstoredetaildetails__row">
                    <div class="visitstoredetaildetails__icon">
                      <fa :icon="['fas', 'phone-alt']"></fa>
                    </div>
                    <div class="visitstoredetaildetails__text">電話</div>
                    <div class="visitstoredetaildetails__value">
                      {{ storeData.storePhone }}
                    </div>
                  </div>
                  <div class="visitstoredetaildetails__row">
                    <div class="visitstoredetaildetails__icon">
                      <fa :icon="['fas', 'globe']"></fa>
                    </div>
                    <div class="visitstoredetaildetails__text">網址</div>
                    <div class="visitstoredetaildetails__value">
                      <a
                        :href="
                          storeData.storeUrl !== ''
                            ? storeData.storeUrl
                            : 'javascript:;'
                        "
                        :target="storeData.storeUrl !== '' ? '_blank' : ''"
                        class="visitstoredetaildetails__link"
                        :class="{
                          'visitstoredetaildetails__link--disabled':
                            storeData.storeUrl === ''
                        }"
                        >商家網址</a
                      >
                    </div>
                  </div>
                  <div class="visitstoredetaildetails__row">
                    <div class="visitstoredetaildetails__icon">
                      <fa :icon="['far', 'star']"></fa>
                    </div>
                    <div class="visitstoredetaildetails__text">總分</div>
                    <div class="visitstoredetaildetails__value">
                      <span>{{ storeData.aveScore }}</span>
                      <div class="visitstoredetaildetails__star">
                        <fa
                          :icon="[i === 0 ? 'far' : 'fas', 'star']"
                          v-for="(i, index) in starCount"
                          :key="index"
                        ></fa>
                      </div>
                      <span class="visitstoredetaildetails__startext">
                        {{ storeData.scoreTimes }} reviews
                      </span>
                    </div>
                  </div>
                  <div class="visitstoredetaildetails__row">
                    <div
                      class="visitstoredetaildetails__text visitstoredetaildetails__rate visitstoredetaildetails__indent"
                    >
                      評分商店
                    </div>
                    <div class="visitstoredetaildetails__value">
                      <div
                        class="visitstoredetaildetails__star"
                        @mouseleave="starsHovered = 0"
                        @click="handleSubmitRating"
                        v-if="storeData.myScore === 0"
                      >
                        <fa
                          :icon="[starsHovered > 0 ? 'fas' : 'far', 'star']"
                          @mouseover="handleMouseoverRating(1)"
                        ></fa>
                        <fa
                          :icon="[starsHovered > 1 ? 'fas' : 'far', 'star']"
                          @mouseover="handleMouseoverRating(2)"
                        ></fa>
                        <fa
                          :icon="[starsHovered > 2 ? 'fas' : 'far', 'star']"
                          @mouseover="handleMouseoverRating(3)"
                        ></fa>
                        <fa
                          :icon="[starsHovered > 3 ? 'fas' : 'far', 'star']"
                          @mouseover="handleMouseoverRating(4)"
                        ></fa>
                        <fa
                          :icon="[starsHovered > 4 ? 'fas' : 'far', 'star']"
                          @mouseover="handleMouseoverRating(5)"
                        ></fa>
                      </div>
                      <div
                        class="visitstoredetaildetails__star"
                        style="cursor: inherit;"
                        v-if="storeData.myScore > 0"
                      >
                        <fa
                          :icon="[i === 0 ? 'far' : 'fas', 'star']"
                          v-for="(i, index) in myStarCount"
                          :key="index"
                        ></fa>
                      </div>
                    </div>
                  </div>
                  <div class="visitstoredetaildetails__row">
                    <div
                      class="visitstoredetaildetails__icon visitstoredetaildetails__hint"
                    >
                      <fa
                        :icon="['fas', 'exclamation-circle']"
                        class="visitstoredetaildetails__hinticon"
                      ></fa>
                    </div>
                    <div
                      class="visitstoredetaildetails__text visitstoredetaildetails__hinttext"
                    >
                      此特約商家無法使用嗎？
                    </div>
                  </div>
                  <base-button type="primary" @click="handleReport">
                    立即通報
                  </base-button>
                </div>
                <div class="visitstoredetaildetails__line"></div>
              </div>
            </b-col>
            <b-col cols="24" lg="8">
              <div class="visitstoredetaildetails">
                <div class="visitstoredetaildetails__wrapper">
                  <div class="visitstoredetaildetails__row">
                    <div class="visitstoredetaildetails__icon">
                      <fa :icon="['far', 'clock']"></fa>
                    </div>
                    <div class="visitstoredetaildetails__text">營業時間</div>
                  </div>
                  <div class="visitstoredetaildetails__row">
                    <div
                      class="visitstoredetaildetails__text visitstoredetaildetails__indent"
                    >
                      {{ storeData.bussinessHours }}
                    </div>
                  </div>
                  <div
                    class="visitstoredetaildetails__row"
                    v-if="storeData.bussinessHours1"
                  >
                    <div
                      class="visitstoredetaildetails__text visitstoredetaildetails__indent"
                    >
                      星期一
                    </div>
                    <div class="visitstoredetaildetails__value">
                      {{ storeData.bussinessHours1 }}
                    </div>
                  </div>
                  <div
                    class="visitstoredetaildetails__row"
                    v-if="storeData.bussinessHours2"
                  >
                    <div
                      class="visitstoredetaildetails__text visitstoredetaildetails__indent"
                    >
                      星期二
                    </div>
                    <div class="visitstoredetaildetails__value">
                      {{ storeData.bussinessHours2 }}
                    </div>
                  </div>
                  <div
                    class="visitstoredetaildetails__row"
                    v-if="storeData.bussinessHours3"
                  >
                    <div
                      class="visitstoredetaildetails__text visitstoredetaildetails__indent"
                    >
                      星期三
                    </div>
                    <div class="visitstoredetaildetails__value">
                      {{ storeData.bussinessHours3 }}
                    </div>
                  </div>
                  <div
                    class="visitstoredetaildetails__row"
                    v-if="storeData.bussinessHours4"
                  >
                    <div
                      class="visitstoredetaildetails__text visitstoredetaildetails__indent"
                    >
                      星期四
                    </div>
                    <div class="visitstoredetaildetails__value">
                      {{ storeData.bussinessHours4 }}
                    </div>
                  </div>
                  <div
                    class="visitstoredetaildetails__row"
                    v-if="storeData.bussinessHours5"
                  >
                    <div
                      class="visitstoredetaildetails__text visitstoredetaildetails__indent"
                    >
                      星期五
                    </div>
                    <div class="visitstoredetaildetails__value">
                      {{ storeData.bussinessHours5 }}
                    </div>
                  </div>
                  <div
                    class="visitstoredetaildetails__row"
                    v-if="storeData.bussinessHours6"
                  >
                    <div
                      class="visitstoredetaildetails__text visitstoredetaildetails__indent"
                    >
                      星期六
                    </div>
                    <div class="visitstoredetaildetails__value">
                      {{ storeData.bussinessHours6 }}
                    </div>
                  </div>
                  <div
                    class="visitstoredetaildetails__row"
                    v-if="storeData.bussinessHours7"
                  >
                    <div
                      class="visitstoredetaildetails__text visitstoredetaildetails__indent"
                    >
                      星期日
                    </div>
                    <div class="visitstoredetaildetails__value">
                      {{ storeData.bussinessHours7 }}
                    </div>
                  </div>
                </div>
                <div class="visitstoredetaildetails__line"></div>
              </div>
            </b-col>
            <b-col cols="24" lg="8">
              <div>
                <div class="visitstoredetaildetails">
                  <div class="visitstoredetaildetails__wrapper">
                    <div class="visitstoredetaildetails__row">
                      <div class="visitstoredetaildetails__icon">
                        <fa :icon="['fas', 'map-marker-alt']"></fa>
                      </div>
                      <div class="visitstoredetaildetails__text">地址</div>
                      <div class="visitstoredetaildetails__value">
                        {{ storeData.storeAddress }}
                      </div>
                    </div>
                    <div class="visitstoredetaildetails__row">
                      <client-only>
                        <div class="visitstoredetaildetails__map">
                          <l-map
                            :zoom="12"
                            :center="[
                              storeData.lat ? storeData.lat : 0,
                              storeData.lat ? storeData.lng : 0
                            ]"
                          >
                            <l-tile-layer
                              url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
                            ></l-tile-layer>
                            <l-marker
                              :lat-lng="[
                                storeData.lat ? storeData.lat : 0,
                                storeData.lat ? storeData.lng : 0
                              ]"
                            ></l-marker>
                          </l-map>
                        </div>
                      </client-only>
                    </div>
                  </div>
                </div>
              </div>
            </b-col>
          </b-row>
        </b-container>
      </main>
    </visit-store-container>
    <client-only>
      <default-modal :active="modalState" @click="handleModalClose">
        <template #title>
          <div class="modalTitleArea" v-if="modalType === 0">
            <h4>店家異常通報</h4>
            <p>感謝您的協助，請提供錯誤情況的詳細資訊，</p>
            <p>STAYFUN將會盡快查證並更新資料</p>
          </div>
          <div class="modalTitleArea" v-if="modalType === 1">
            <h4>您的回報已送出！</h4>
            <p>感謝您的協助</p>
            <p>STAYFUN將會盡快查證並更新資料</p>
          </div>
        </template>
        <validation-observer v-slot="{ invalid }" v-if="modalType === 0">
          <form @submit.prevent="handleSubmitReport">
            <validation-provider rules="required" v-slot="{ errors }">
              <base-label
                text="問題類型"
                :valid="!errors.length"
                required
                :hint="{
                  type: 'warning',
                  text: errors.length ? errors[0] : ''
                }"
              >
                <base-select
                  placeholder="請選擇問題類型"
                  v-model="reportForm.problemType"
                  :options="[
                    { label: '電話錯誤', value: 0, id: '1' },
                    { label: '地址錯誤', value: 1, id: '2' },
                    { label: '優惠項目錯誤', value: 2, id: '3' },
                    { label: '無法使用特約優惠', value: 3, id: '4' },
                    { label: '店家已歇業', value: 4, id: '5' },
                    { label: '其他', value: 5, id: '6' }
                  ]"
                  :valid="!errors.length"
                />
              </base-label>
            </validation-provider>
            <validation-provider rules="required" v-slot="{ errors }">
              <base-label
                text="消費日期/時間"
                required
                class="formRange"
                :valid="!errors.length"
                :hint="{
                  type: 'warning',
                  text: errors.length ? errors[0] : ''
                }"
              >
                <base-datepicker
                  v-model="reportForm.problemDate"
                  format="YYYY-MM-DD"
                  :valid="!errors.length"
                />
              </base-label>
            </validation-provider>
            <base-label
              text="是否告知為STAYFUN用戶？"
              required
              class="formRange"
            >
              <b-form-radio-group
                id="radio-group-1"
                v-model="reportForm.isStayfunUser"
                name="radio-sub-component1"
              >
                <b-form-radio :value="true">是</b-form-radio>
                <b-form-radio :value="false">否</b-form-radio>
              </b-form-radio-group>
            </base-label>
            <base-label
              text="是否出示STAYFUN電子識別證？"
              required
              class="formRange"
            >
              <b-form-radio-group
                id="radio-group-2"
                v-model="reportForm.isStayfunPass"
                name="radio-sub-component2"
              >
                <b-form-radio :value="true">是</b-form-radio>
                <b-form-radio :value="false">否</b-form-radio>
              </b-form-radio-group>
            </base-label>
            <validation-provider v-slot="{ errors }" rules="required|max:500">
              <base-label
                text="使用經過"
                required
                class="formRange"
                :valid="!errors.length"
                :hint="{
                  text: errors.length ? errors[0] : '',
                  type: 'warning'
                }"
              >
                <base-textarea
                  v-model="reportForm.problemDesc"
                  :valid="!errors.length"
                />
              </base-label>
            </validation-provider>
            <base-button
              :type="
                invalid ||
                reportForm.problemDesc.length <= 0 ||
                reportForm.problemType.length === 0 ||
                reportForm.problemDate.length === 0
                  ? 'greyOne'
                  : 'primary'
              "
              display="block"
              class="formRange"
              :disabled="
                invalid ||
                reportForm.problemDesc.length <= 0 ||
                reportForm.problemType.length === 0 ||
                reportForm.problemDate.length === 0
              "
              >確定</base-button
            >
          </form>
        </validation-observer>
      </default-modal>
    </client-only>
    <client-only>
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
    </client-only>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { ProxyRequestObject, ResponseObject } from 'Http'
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import VisitStoreContainer from '~/components/VisitStoreContainer.vue'
import BaseButton from '~/components/BaseButton.vue'
import { visitStore, dialogStore, authStore } from '~/store'
import { $axios } from '~/utils/api'
import DefaultModal from '~/components/DefaultModal.vue'
import BaseDatepicker from '~/components/BaseDatepicker.vue'
import BaseSelect from '~/components/BaseSelect.vue'
import BaseLabel from '~/components/BaseLabel.vue'
import BaseTextarea from '~/components/BaseTextarea.vue'
import DefaultDialog from '~/components/DefaultDialog.vue'

@Component({
  middleware: 'auth',
  components: {
    DefaultModal,
    BaseButton,
    VisitStoreContainer,
    BaseDatepicker,
    BaseSelect,
    BaseLabel,
    BaseTextarea,
    DefaultDialog,
    ValidationObserver,
    ValidationProvider
  }
})
export default class VisitStoreDetails extends Vue {
  public reportForm: any = {
    problemType: '',
    problemDate: '',
    isStayfunUser: true,
    isStayfunPass: true,
    problemDesc: ''
  }

  public modalType = 0

  public async handleSubmitReport(): Promise<any> {
    this.$nuxt.$loading.start()
    try {
      await this.sendStoreReportRequest()
      this.modalType = 1
    } catch (e) {
      // error
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

  public async handleDialogConfirm() {
    this.$nuxt.$loading.start()
    const { stars } = dialogStore.confirmAction
    try {
      await this.sendSubmitRatingRequest(stars)
      await this.sendGetStoreDetailRequest()
      dialogStore.setConfirmed(true)
      dialogStore.setActive(false)
      dialogStore.setMaskActive(false)
    } catch (e) {
      // error
      dialogStore.setContent({
        title: '此特約商店已經評分',
        type: 'accept',
        icon: true,
        initializer: 'visitstore-rating-error'
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

  get storeData() {
    return visitStore.storeDetail
  }

  get starCount() {
    const count = visitStore.storeDetail.aveScore
    const arr: Array<number> = []
    for (let i = 1; i <= 5; i++) {
      arr.push(i <= count ? 1 : 0)
    }
    return arr
  }

  get myStarCount() {
    const count = visitStore.storeDetail.myScore
    const arr: Array<number> = []
    for (let i = 1; i <= 5; i++) {
      arr.push(i <= count ? 1 : 0)
    }
    return arr
  }

  get storeSpecialReformat() {
    return Object.keys(this.storeData).length
      ? this.storeData.memberSpecial.split('\n')
      : []
  }

  public handleDownloadApp() {
    dialogStore.setActive(true)
    dialogStore.setMaskActive(true)
    dialogStore.setContent({
      title: 'qrcode',
      message:
        '請用手機掃描 QRcode 前往下載 STAYFUN APP，並向商家出示手機識別證後即可享受專屬優惠！',
      type: 'accept',
      initializer: 'visitstore-download'
    })
  }

  public handleMouseoverRating(order: number) {
    this.starsHovered = order
  }

  public starsHovered: number = 0

  public handleSubmitRating() {
    const stars = this.starsHovered
    dialogStore.setActive(true)
    dialogStore.setMaskActive(true)
    if (this.storeData.myScore <= 0) {
      dialogStore.setContent({
        title: '確定送出評分？',
        message: `已將商家評為 ${stars} 顆星，點選確定後將無法再更改喔`,
        type: 'confirm',
        icon: true,
        initializer: 'visitstore-rating'
      })
      dialogStore.setConfirmAction({ stars })
    }
  }

  // API
  public async sendSubmitRatingRequest(score: number): Promise<any> {
    const requestBody: ProxyRequestObject = {
      endpoint: '/api/Store/Score',
      key: process.env.apiKey,
      data: { storeId: this.$route.params.serialno, score },
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

  public async sendGetStoreDetailRequest(): Promise<any> {
    await visitStore.getStoreDetail({
      token: this.$cookies.get('accessToken'),
      serialno: this.$route.params.serialno
    })
  }

  public async sendStoreReportRequest(): Promise<any> {
    const {
      problemType,
      problemDate,
      isStayfunUser,
      isStayfunPass,
      problemDesc
    } = this.reportForm
    const requestBody: ProxyRequestObject = {
      endpoint: '/api/Store/ErrorReports',
      key: process.env.apiKey,
      data: {
        storeSerialno: this.$route.params.serialno,
        mobilephone: authStore.user
          ? authStore.user.phonenumber
            ? authStore.user.phonenumber
            : authStore.user.mobilephonenumber
            ? authStore.user.mobilephonenumber
            : ''
          : '',
        primaryemail: authStore.user ? authStore.user.email : '',
        type: problemType,
        startDate: problemDate + ' 00:00:00',
        reportinDetail: problemDesc,
        showMemberType: isStayfunUser ? 1 : 0,
        showCardType: isStayfunPass ? 1 : 0
      },
      method: 'post',
      token: this.$cookies.get('accessToken')
    }
    try {
      const result: ResponseObject = await $axios.post('/api', requestBody)
      switch (Number(result.data.syscode)) {
        case 200:
          return result.data.data
        case 400:
          return new Error('Field Error')
        default:
          return new Error('Error reporting the store')
      }
    } catch (e) {
      throw new Error(`Backend Error: ${e}`)
    }
  }

  public modalState: boolean = false

  public handleReport(): void {
    dialogStore.setMaskActive(true)
    this.modalState = true
    this.modalType = 0
  }

  public handleModalClose() {
    this.modalState = false
    dialogStore.setMaskActive(false)
  }

  public async fetch() {
    try {
      await this.sendGetStoreDetailRequest()
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
        await this.sendGetStoreDetailRequest()
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
@import '../../assets/scss/utils/variables';
@import '../../assets/scss/utils/media';
.formRange {
  margin-top: $spacing-xl;
}

.modalTitleArea {
  text-align: center;
  > h4 {
    font-size: $fz-xxl;
    font-weight: bold;
    padding-bottom: $spacing-s;
  }
  > p {
    font-size: $fz-s;
    font-weight: bold;
  }
}

.visitstoredetail {
  padding: $spacing-xl 0;
  @include grid-md {
    padding: 60px 60px 80px;
  }
}
.visitstoredetaildescription,
.visitstoredetailbuttonbox {
  margin-top: 40px;
  margin-bottom: $spacing-xl;
}
.visitstoredetailimgbox {
  border: 1px solid $greyOne;
  margin-bottom: $spacing-xl;
  &__img {
    height: 360px;
    width: 100%;
    background-image: url(https://hnstayfuntst.blob.core.windows.net/store/defaultimg/live_img.png);
    background-position: center center;
    background-size: contain;
    background-repeat: no-repeat;
  }
  &__desc {
    color: $greyTwo;
    font-size: $fz-s;
    font-weight: bold;
    padding: $spacing-s $spacing-s $spacing-l $spacing-s;
  }
}
.visitstoredetailtitlebox {
  display: flex;
  align-items: center;
  &__desc {
    margin-left: $spacing-m;
    line-height: 2;
  }
  &__title {
    font-weight: bold;
    font-size: $fz-xxl;
    color: $greyThree;
  }
  &__subtitle {
    font-size: $fz-m;
    color: $greyTwo;
    font-weight: bold;
  }
  &__img {
    img {
      height: 70px;
      width: 70px;
      border: 1px solid $greyTwo;
      border-radius: 50%;
    }
  }
}

.visitstoredetaildescription {
  display: flex;
  align-items: center;
  &__badge {
    flex-shrink: 0;
    border: 1px solid $primary;
    color: $primary;
    padding: 0 $spacing-m;
    border-radius: 4px;
    font-weight: bold;
  }
  &__badgedesc {
    flex-grow: 0;
    color: $greyTwo;
    margin-left: $spacing-l;
  }
}
.visitstoredetaildetails {
  display: flex;
  padding-top: $spacing-xl;
  font-weight: bold;
  width: 100%;
  &__indent {
    padding-left: 30px;
  }
  &__wrapper {
    width: 100%;
  }
  &__line {
    @include grid-lg {
      opacity: 1;
    }
    opacity: 0;
    height: 400px;
    width: 1px;
    background-color: $greyOne;
    margin-left: auto;
  }
  &__row {
    display: flex;
    font-size: $fz-s;
    color: $greyThree;
    margin-bottom: $spacing-xl;
  }
  &__icon {
    width: 30px;
    font-size: $fz-l;
  }
  &__text,
  &__value {
    padding-top: 3px;
  }
  &__text {
    min-width: 30px;
    margin-right: $spacing-m;
  }
  &__star {
    margin-left: $spacing-l;
    margin-right: $spacing-l;
    cursor: pointer;
  }
  &__startext {
    color: $greyTwo;
    font-size: $fz-xs;
  }
  &__value {
    display: flex;
  }
  &__rate {
    margin-right: 0;
  }
  &__hint {
    color: $orangeDark;
  }
  &__hinttext,
  __hinticon {
    color: $orangeDark;
  }
  &__map {
    padding-top: $spacing-xs;
    width: 100%;
    height: 300px;
  }
  &__link {
    text-decoration: underline;
    &--disabled {
      cursor: not-allowed;
      color: $whiteOne;
      text-decoration: line-through;
    }
  }
}

.visitstoredetailborder {
  border-top: 1px solid $greyOne;
}
</style>
