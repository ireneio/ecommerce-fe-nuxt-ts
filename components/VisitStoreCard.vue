<template>
  <div @click="$emit('update-route', serialno)">
    <div class="visitStoreCard">
      <div
        class="visitStoreCard__img"
        :style="{
          'background-image': `url(${logoUrl !== '' ? logoUrl : images[type]})`
        }"
      ></div>
      <div class="visitStoreCard__text">
        <div class="visistStoreCard__desc" style="width: 100%;">
          <h4 class="visitStoreCard__title">{{ title }}</h4>
          <p class="visitStoreCard__subtitle">{{ subtitle }}</p>
        </div>
        <div class="visitStoreCard__descImg" v-if="cardType !== 'coupon'">
          <img
            src="https://hnstayfuntst.blob.core.windows.net/store/defaultimg/stayfun_logo_defualt.png"
            alt="description image"
          />
        </div>
        <div class="visitStoreCard__pricebox" v-if="cardType === 'coupon'">
          <div class="visitStoreCard__ogPrice">原價 ${{ originalPrice.toLocaleString('en') }}</div>
          <div class="visitStoreCard__newPrice">${{ salePrice.toLocaleString('en') }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'

interface images {
  生活: string
  美食: string
  住宿: string
  舒壓: string
  時尚: string
}

@Component
export default class VisitStoreCard extends Vue {
  @Prop({
    type: String,
    default() {
      return ''
    }
  })
  readonly type!: '生活' | '美食' | '住宿' | '舒壓' | '時尚'

  @Prop({
    type: String,
    default() {
      return 'Placeholder Title'
    }
  })
  readonly title!: string

  @Prop({
    type: String,
    default() {
      return 'Placeholder Subtitle'
    }
  })
  readonly subtitle!: string

  @Prop({
    type: String,
    default() {
      return ''
    }
  })
  readonly serialno!: string

  @Prop({
    type: String,
    default() {
      return ''
    }
  })
  readonly logoUrl!: string

  @Prop({
    type: String,
    default() {
      return ''
    }
  })
  readonly cardType!: string

  @Prop({
    type: Number,
    default() {
      return 0
    }
  })
  readonly originalPrice!: number

  @Prop({
    type: Number,
    default() {
      return 0
    }
  })
  readonly salePrice!: number

  public images: images = {
    生活:
      'https://hnstayfuntst.blob.core.windows.net/store/defaultimg/spa_img.png',
    美食:
      'https://hnstayfuntst.blob.core.windows.net/store/defaultimg/live_img.png',
    住宿:
      'https://hnstayfuntst.blob.core.windows.net/store/defaultimg/food_img.png',
    舒壓:
      'https://hnstayfuntst.blob.core.windows.net/store/defaultimg/fasion_img.png',
    時尚:
      'https://hnstayfuntst.blob.core.windows.net/store/defaultimg/hotel_img.png'
  }
}
</script>
<style lang="scss" scoped>
@import '../assets/scss/utils/variables';
.visitStoreCard {
  min-height: 300px;
  border-radius: 4px;
  border: 1px solid $greyOne;
  cursor: pointer;
  &:focus,
  &:hover {
    box-shadow: 0 0 7px 3px rgba(0, 0, 0, 0.1);
  }
  &__img {
    height: 180px;
    width: 100%;
    background-position: center center;
    background-repeat: no-repeat;
    background-size: cover;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
  }
  &__text {
    padding: $spacing-m;
    display: flex;
    flex-wrap: wrap;
  }
  &__desc {
    width: 100%;
  }
  &__title {
    font-size: $fz-s;
    color: $greyThree;
    font-weight: bold;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    // max-width: 90%;
  }
  &__subtitle {
    font-size: $fz-xs;
    color: $greyTwo;
    font-weight: bold;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  &__descImg {
    flex: 0 0 100%;
    margin-left: auto;
    margin-top: $spacing-m;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    img {
      border-radius: 50%;
      border: 1px solid $greyOne;
    }
  }
  &__pricebox {
    flex: 0 0 100%;
    position: absolute;
    bottom: $spacing-xs;
    right: $spacing-xxl;
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
  }
  &__ogPrice {
    color: $greyTwo;
    text-decoration: line-through;
    font-size: $fz-xs;
    margin-bottom: $spacing-xs;
  }
  &__newPrice {
    font-size: $fz-l;
    color: $primary;
    margin-left: $spacing-m;
  }
}
</style>
