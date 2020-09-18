<template>
  <div class="downloadBanner" v-show="active">
    <div class="downloadBanner__cross" @click="active = false">&#10006;</div>
    <div class="downloadBanner__logo"></div>
    <div class="downloadBanner__info">
      <div class="downloadBanner__title">STAYFUN</div>
      <div class="downloadBanner__subtitle">在 App 打開</div>
    </div>
    <div class="downloadBanner__btn" @click="handleOpenApp">開啟</div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'

@Component
export default class DefaultDownloadBanner extends Vue {
  @Prop({
    type: String,
    default() {
      return ''
    }
  })
  readonly link!: string

  private active: boolean = true

  private handleOpenApp(): void {
    const url = 'http://onelink.to/sfun'
    window.open(url, '_blank')
  }
}
</script>
<style lang="scss" scoped>
@import '../assets/scss/utils/variables';
@import '../assets/scss/utils/media';

.downloadBanner {
  display: flex;
  align-items: center;
  background-color: #fff;
  border-bottom: 1px solid $whiteOne;
  @include grid-lg {
    display: none;
  }
  &__cross {
    font-weight: bold;
    font-size: $fz-l;
    padding: $spacing-xl $spacing-l;
  }
  &__logo {
    height: 50px;
    width: 50px;
    background-image: url(/icon.png);
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center center;
    border-radius: 4px;
    border: 1px solid $greyTwo;
  }
  &__info {
    margin-left: $spacing-l;
  }
  &__title {
    font-size: $fz-m;
    font-weight: bold;
  }
  &__subtitle {
    font-size: $fz-xs;
    color: $greyTwo;
  }
  &__btn {
    margin-left: auto;
    color: $secondary;
    font-size: $fz-m;
    text-decoration: underline;
    padding: $spacing-xl $spacing-l;
    font-weight: bold;
    cursor: pointer;
  }
}
</style>
