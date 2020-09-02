<template>
  <span class="landingPageStoreIcon">
    <span
      class="landingPageStoreIcon__img"
      :style="{ 'background-image': `url(${url})` }"
    ></span>
    <span class="landingPageStoreIcon__text">{{ text }}</span>
  </span>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'

@Component
export default class LandingPageStoreIcon extends Vue {
  @Prop({
    type: String,
    default() {
      return ''
    }
  })
  readonly url!: string

  @Prop({
    type: String,
    default() {
      return ''
    }
  })
  readonly text!: string
}
</script>
<style lang="scss" scoped>
@import '../assets/scss/utils/variables';

.landingPageStoreIcon {
  cursor: pointer;
  display: flex;
  flex-direction: column;
  height: auto;
  &__text {
    width: 80px;
    font-size: $fz-m;
    color: $greyThree;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-top: $spacing-m;
    text-align: center;
  }
  &__img {
    width: 80px;
    height: 80px;
    border-radius: 5px;
    background-position: center center;
    background-size: cover;
    background-color: $primary;
  }
}
</style>
