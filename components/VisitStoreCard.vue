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
        <div class="visistStoreCard__desc">
          <h4 class="visitStoreCard__title">{{ title }}</h4>
          <p class="visitStoreCard__subtitle">{{ subtitle }}</p>
        </div>
        <div class="visitStoreCard__descImg">
          <img
            src="https://hnstayfuntst.blob.core.windows.net/store/defaultimg/stayfun_logo_defualt.png"
            alt="description image"
          />
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
  height: 230px;
  border-radius: 4px;
  border: 1px solid $greyOne;
  cursor: pointer;
  &:hover {
    box-shadow: 0 0 7px 3px rgba(0, 0, 0, 0.1);
  }
  &__img {
    height: 60%;
    width: 100%;
    background-position: center center;
    background-repeat: no-repeat;
    background-size: cover;
  }
  &__text {
    padding: $spacing-m;
    display: flex;
  }
  &__title {
    font-size: $fz-s;
    color: $greyThree;
    font-weight: bold;
  }
  &__subtitle {
    font-size: $fz-xs;
    color: $greyTwo;
    font-weight: bold;
  }
  &__descImg {
    margin-left: auto;
    display: flex;
    align-items: center;
    img {
      border-radius: 50%;
      border: 1px solid $greyOne;
    }
  }
}
</style>
