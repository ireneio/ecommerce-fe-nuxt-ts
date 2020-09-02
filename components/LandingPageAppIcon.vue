<template>
  <a href="javascript:;" class="landingPageAppIcon" @click="$emit('click')">
    <span
      class="landingPageAppIcon__img"
      :style="{ 'background-image': `url(${icon})` }"
    ></span>
    <span class="landingPageAppIcon__text">{{ text }}</span>
  </a>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'

@Component
export default class LandingPageAppIcon extends Vue {
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

  @Prop({
    type: String,
    default() {
      return ''
    }
  })
  readonly icon!: string
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/utils/variables';

.landingPageAppIcon {
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: auto;
  &__text {
    display: block;
    margin-top: $spacing-s;
    font-size: $fz-s;
    width: 70px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: center;
  }
  &__img {
    display: block;
    width: 70px;
    height: 60px;
    background-position: center center;
    background-size: contain;
    background-repeat: no-repeat;
  }
}
</style>
