<template>
  <div>
    <visit-store-container>
      <div class="couponPurchase__wrapper">
        <div class="couponPurchase">
          <section class="couponPurchase__banner">
            <div
              class="couponPurchaseBanner__img"
              :style="{ 'background-image': `url(${couponDetail.imageUrl})` }"
            ></div>
            <div class="couponPurchaseBanner__text">
              <h3 class="couponPurchaseBanner__title">
                {{ couponDetail.couponName }}
              </h3>
              <div class="couponPurchaseBanner__subtext">
                <div class="couponPurchaseBanner__subtextTitle">
                  {{ couponDetail.storeName }}
                </div>
                <div class="couponPurchaseBanner__subtextDate">
                  {{ couponDetail.lastUseTimeDisplay }}
                </div>
              </div>
            </div>
          </section>
          <section class="couponPurchase__order">
            <h4 class="couponPurchase__header">訂單總計</h4>
            <div class="couponPurchase__body">
              <div class="couponPurchaseOrder__amount">
                <div class="couponPurchaseOrder__amountText">數量</div>
                <div class="couponPurchaseOrder__amountQty">
                  <button
                    class="couponPurchaseOrder__amountQtyBtn couponPurchaseOrder__amountQtyBtn--prev"
                    :class="{
                      'couponPurchaseOrder__amountQtyBtn--disabled':
                        form.quantity === 1
                    }"
                    :disabled="form.quantity === 1"
                    @click="handleUpdateAmount(-1)"
                  >
                    -
                  </button>
                  <span class="couponPurchaseOrder__amountQtyText">
                    <label for="qty">
                      {{ form.quantity }}
                      <input
                        id="qty"
                        type="number"
                        v-model="form.quantity"
                        min="0"
                        max="999999999"
                      />
                    </label>
                  </span>
                  <button
                    class="couponPurchaseOrder__amountQtyBtn couponPurchaseOrder__amountQtyBtn--next"
                    :class="{
                      'couponPurchaseOrder__amountQtyBtn--disabled':
                        form.quantity === 999999999
                    }"
                    :disabled="form.quantity === 999999999"
                    @click="handleUpdateAmount(1)"
                  >
                    +
                  </button>
                </div>
              </div>
              <div class="couponPurchaseOrder__subtext">
                <h6 class="couponPurchaseOrder__subtextTitle">總金額</h6>
                <div class="couponPurchaseOrder__subtextContent">
                  ${{ form.amount }}
                </div>
              </div>
              <div class="couponPurchaseOrder__subtext">
                <h6 class="couponPurchaseOrder__subtextTitle">享樂金折抵</h6>
                <div class="couponPurchaseOrder__subtextContent">
                  ${{ discount }}
                </div>
              </div>
              <div class="couponPurchaseOrder__footer">
                <h6 class="couponPurchaseOrder__footerTitle">應付金額</h6>
                <div class="couponPurchaseOrder__footerContent">
                  ${{ subtotal }}
                </div>
              </div>
            </div>
          </section>
          <section class="couponPurchase__receipt">
            <h4 class="couponPurchase__header">付款與發票類型</h4>
            <div class="couponPurchase__body">
              <div class="couponPurchaseReceipt">
                <div class="couponPurchaseReceipt__title">付款方式</div>
                <div class="couponPurchaseReceipt__titleText">
                  {{ form.paymentType }}
                </div>
              </div>
              <div
                class="couponPurchaseReceipt__receiptbox"
                v-show="subtotal > 0"
              >
                <div class="couponPurchaseReceipt__title">發票類型</div>
              </div>
              <div
                class="couponPurchaseReceipt__receiptbox"
                v-show="subtotal > 0"
              >
                <default-receipt-selector
                  @input="handleReceiptTypeUpdate"
                  @address-area-update="handleGetCounty"
                  @form-update="receiptInfo = $event"
                  :areaOptions="area"
                  :countyOptions="county"
                />
              </div>
            </div>
          </section>
          <div class="couponPurchase__btn">
            <base-button
              :type="
                receiptInfo.isValid || subtotal === 0 ? 'primary' : 'greyOne'
              "
              display="block"
              @click="handlePurchase"
              :disabled="!receiptInfo.isValid && subtotal > 0"
              >立即購買
            </base-button>
          </div>
          <section class="couponPurchase__footer">
            <p>
              兌換說明 *使用時請先告知使用平台兌換券。
              <br />*每人每次僅可使用單一手機兌換本商品，不接受第二隻以上行動裝置同時進行兌換。
              <br />*本票券不得與店家其他優惠合併使用，恕無法兌換現金及找零，實際使用方式依店家規定為準。
              <br />*因店家狀況難以隨時掌握，建議您使用前先以電話確認營業狀況並預約，以免向隅。
              <br />*未持優惠券而共同前往之消費者，依店家規定支付店內最低消費額。
              <br />*若該次消費超過兌換券面額，依店家規定補足其差額。
              <br />*消費品項依店家實際提供為主，照片僅供參考。
              <br />*為保障您的權益，請於兌換時出示行動裝置之認證頁面，並在店家面前完成核銷掃描。
              <br />*兌換截止日請參考票券說明。
              *若兌換券逾期未使用，按平台規則辦理。
              <br />*若有其他疑問，請洽STAYFUN客服中心(02)6617-7100。
            </p>
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
import { Component, Vue, Watch } from 'nuxt-property-decorator'
import VueSlickCarousel from 'vue-slick-carousel'
import { ProxyRequestObject, ResponseObject } from 'Http'
import { $axios } from '~/utils/api'
import VisitStoreContainer from '~/components/VisitStoreContainer.vue'
import BaseButton from '~/components/BaseButton.vue'
import DefaultReceiptSelector from '~/components/DefaultReceiptSelector.vue'
import DefaultDialog from '~/components/DefaultDialog.vue'
import { visitStore, commonStore, dialogStore, pointStore } from '~/store'

@Component({
  layout: 'default',
  middleware: 'auth',
  components: {
    VisitStoreContainer,
    BaseButton,
    VueSlickCarousel,
    DefaultReceiptSelector,
    DefaultDialog
  }
})
export default class ShoppingMallPurchase extends Vue {
  public receiptInfo: any = {}

  public async handlePurchase() {
    try {
      this.$nuxt.$loading.start()
      const result = await this.sendCouponTransactionRequest()
      if (result.cashAmount > 0 && result.paymentUrl.toString() !== '') {
        window.open(result.paymentUrl, '_blank')
      } else {
        dialogStore.setContent({
          title: '訂單成功',
          message: '請至我的專區查看',
          type: 'confirm',
          initializer: 'coupon-order-success'
        })
        dialogStore.setConfirmAction('member-info')
        dialogStore.setMaskActive(true)
        dialogStore.setActive(true)
      }
      this.$nuxt.$loading.finish()
    } catch (e) {
      // error
      dialogStore.setContent({
        title: '訂單失敗',
        message: e.message,
        type: 'accept'
      })
      dialogStore.setMaskActive(true)
      dialogStore.setActive(true)
      this.$nuxt.$loading.finish()
    }
  }

  get dialogState() {
    return dialogStore.active
  }

  get dialogContent() {
    return dialogStore.content
  }

  public handleDialogConfirm() {
    dialogStore.setActive(false)
    dialogStore.setMaskActive(false)
    this.$router.push({ name: dialogStore.confirmAction })
  }

  public handleDialogClose() {
    const initalizer = dialogStore.content.initializer
    dialogStore.setActive(false)
    dialogStore.setMaskActive(false)
    if (initalizer === 'coupon-order-success') {
      this.$router.push({ name: 'shoppingmall' })
    }
  }

  get couponDetail() {
    return visitStore.couponDetail
  }

  public form: any = {
    quantity: 1,
    amount: 0,
    invoiceType: 6,
    paymentType: '無須付款'
  }

  get discount() {
    let discount = 0
    if (pointStore.pointDiscount && pointStore.pointDiscount.length) {
      discount = pointStore.pointDiscount.reduce((prev: number, curr: any) => {
        if (curr.pointType.toString() === '點數折抵') {
          return (prev += curr.pointAmount)
        } else {
          return prev
        }
      }, 0)
    }
    return discount
  }

  @Watch('subtotal')
  public onSubtotalChange(newVal: number) {
    if (newVal > 0) {
      this.form.paymentType = '信用卡/其他'
    } else {
      this.form.paymentType = '無須付款'
    }
  }

  get subtotal() {
    const total = Number(this.form.amount) - Number(this.discount)
    if (total < 0) return 0
    return total
  }

  public receiptType: '1' | '2' | '3' | '4' | '5' | '' = ''

  public async handleReceiptTypeUpdate(val: '1' | '2' | '3' | '4' | '5') {
    if (this.receiptType !== '2' && this.receiptType !== '5') {
      if (val === '2' || val === '5') {
        await this.sendGetAreasRequest()
      }
    }
    this.receiptType = val
  }

  get area() {
    return commonStore.areas.length
      ? commonStore.areas.map((item: any) => ({
          label: item.area,
          value: item.area
        }))
      : []
  }

  get county() {
    return commonStore.countyList.length
      ? commonStore.countyList.map((item: any) => ({
          label: item.area,
          value: item.area,
          zipcode: item.zipCode
        }))
      : []
  }

  public async handleGetCounty(val: number | string) {
    await this.sendGetCountyRequest(val)
  }

  public async handleUpdateAmount(val: number) {
    if (!(val === -1 && this.form.amount === 0)) {
      this.form.quantity += val
      this.form.amount = this.couponDetail.salePrice * this.form.quantity
    }
    // this.$nuxt.$loading.start()
    await this.sendGetPointDiscountRequest()
    // this.$nuxt.$loading.finish()
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

  public async sendGetPointDiscountRequest() {
    try {
      await pointStore.getDiscountAmount({
        token: this.$cookies.get('accessToken'),
        amount: this.form.amount
      })
    } catch (e) {
      // error
      throw new Error(e)
    }
  }

  public async sendCouponTransactionRequest() {
    const { quantity, amount } = this.form
    const requestBody: ProxyRequestObject = {
      endpoint: '/api/CouponTransaction/Order',
      key: process.env.apiKey,
      data: {
        ticketId: this.$route.params.serialno,
        quantity,
        invoiceType: Number(this.receiptType),
        amount,
        isIE: false
      },
      method: 'post',
      token: this.$cookies.get('accessToken')
    }
    // 會員載具
    if (this.receiptType === '2') {
      requestBody.data.buyerName = this.receiptInfo.receiver.toString()
      requestBody.data.buyerAddress =
        this.receiptInfo.addressZipCode.toString() +
        this.receiptInfo.addressArea.toString() +
        this.receiptInfo.addressCounty.toString() +
        this.receiptInfo.addressLine.toString()
    }
    // 手機載具 || 自然人憑證
    if (this.receiptType === '3' || this.receiptType === '4') {
      requestBody.data.carrierId = this.receiptInfo.barcode.toString()
    }
    // 三聯式發票
    if (this.receiptType === '5') {
      requestBody.data.buyerName = this.receiptInfo.receiver.toString()
      requestBody.data.buyerAddress =
        this.receiptInfo.addressZipCode.toString() +
        this.receiptInfo.addressArea.toString() +
        this.receiptInfo.addressCounty.toString() +
        this.receiptInfo.addressLine.toString()
      requestBody.data.buyerID = this.receiptInfo.identification.toString()
    }

    const result: ResponseObject = await $axios.post('/api', requestBody)
    switch (result.data.syscode) {
      case 200:
        return result.data.data
      case 60007:
        throw new Error('剩餘張數不足，請重新選擇數量')
      case 500:
        throw new Error('Server Error')
      default:
        return null
    }
  }

  public async sendGetAreasRequest() {
    try {
      await commonStore.getAreas({ token: this.$cookies.get('accessToken') })
    } catch (e) {
      // error
    }
  }

  public async sendGetCountyRequest(areaName: string | number) {
    try {
      await commonStore.getCounty({
        token: this.$cookies.get('accessToken'),
        areaName
      })
    } catch (e) {
      // error
    }
  }

  public async fetch() {
    try {
      await this.sendGetCouponDetailRequest()
      this.form.amount = this.couponDetail.salePrice
      await this.sendGetPointDiscountRequest()
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
        this.form.amount = this.couponDetail.salePrice
        if (this.form.amount > 0) {
          this.form.paymentType = '信用卡/其他'
        }
        await this.sendGetPointDiscountRequest()
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

.couponPurchase {
  &__wrapper {
    padding: $spacing-xxl;
    @include grid-md {
      padding: $spacing-xxl 80px;
    }
  }
  &__banner {
    display: flex;
    flex-wrap: wrap;
    padding: 30px $spacing-xl;
  }
  &__banner,
  &__order,
  &__receipt,
  &__subtext {
    border-radius: 4px;
    border: 1px solid $whiteOne;
  }
  &__header {
    font-size: $fz-xxl;
    font-weight: bold;
    background-color: $whiteThree;
    color: $greyThree;
    padding: $spacing-xl;
  }
  &__body {
    padding: $spacing-xl;
  }
  &__order,
  &__subtext,
  &__receipt,
  &__btn,
  &__footer {
    margin-top: $spacing-xxxl;
  }
  &__footer {
    color: $greyTwo;
    font-weight: bold;
    font-size: $fz-xs;
  }
}
.couponPurchaseBanner {
  &__img {
    flex: 0 0 100%;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
    width: 100%;
    height: 345px;
    @include grid-md {
      flex: 0 0 40%;
    }
  }
  &__text {
    flex: 0 0 100%;
    position: relative;
    margin-top: 40px;
    @include grid-md {
      margin-top: 0;
      margin-left: $spacing-xxl;
      flex: 0 0 calc(59% - 24px);
    }
  }
  &__title {
    font-size: $fz-xxl;
    color: $greyThree;
    font-weight: bold;
  }
  &__subtext {
    text-align: right;
    font-weight: bold;
    margin-top: $spacing-m;
    @include grid-md {
      position: absolute;
      bottom: 0;
      right: 0;
      margin-top: 0;
    }
  }
  &__subtextTitle {
    color: $greyTwo;
    font-size: $fz-m;
  }
  &__subtextDate {
    margin-top: $spacing-m;
    color: $greyThree;
    font-size: $fz-s;
  }
}
.couponPurchaseOrder {
  &__amount {
    display: flex;
    justify-content: space-between;
    padding-bottom: $spacing-xxl;
    border-bottom: 1px solid $whiteOne;
  }
  &__amountText {
    font-weight: bold;
    font-size: $fz-l;
    color: $greyThree;
  }
  &__amountQty {
    display: flex;
  }
  &__amountQtyBtn {
    width: 30px;
    height: 30px;
    line-height: 15px;
    background-color: $primary;
    color: #fff;
    font-size: $fz-xxl;
    border: none;
    &--prev {
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
    }
    &--next {
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
    }
  }
  &__amountQtyText {
    width: 60px;
    height: 30px;
    padding-top: 2px;
    text-align: center;
    font-weight: bold;
    color: $greyThree;
    font-size: $fz-m;
    border-top: 1px solid $whiteOne;
    border-bottom: 1px solid $whiteOne;
    input {
      display: none;
    }
  }
  &__subtext {
    display: flex;
    justify-content: space-between;
    margin-top: $spacing-l;
    color: $greyTwo;
  }
  &__subtextTitle {
    font-weight: bold;
    font-size: $fz-m;
  }
  &__subtextContent {
    font-weight: bold;
    font-size: $fz-m;
  }
  &__footer {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-top: $spacing-xl;
  }
  &__footerTitle {
    font-size: $fz-m;
    color: $greyThree;
    font-weight: bold;
  }
  &__footerContent {
    position: relative;
    top: $spacing-xs + 1px;
    color: $orangeDark;
    font-size: $fz-xxl;
    font-weight: bold;
  }
}
.couponPurchaseReceipt {
  display: flex;
  justify-content: space-between;
  padding-bottom: $spacing-xxl;
  border-bottom: 1px solid $whiteOne;
  &__title,
  &__titleText {
    font-weight: bold;
    font-size: $fz-m;
  }
  &__titleText {
  }
  &__receiptbox {
    margin-top: $spacing-l;
  }
}
</style>
