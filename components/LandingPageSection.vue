<template>
  <section class="landingPageSection">
    <div class="landingPageSection__banner">
      <span class="landingPageSection__icon" :style="{ 'background-image': `url(${iconUrl})` }"></span>
      <h2 class="landingPageSection__title">{{ title }}</h2>
      <span class="landingPageSection__newIcon" v-if="hasNew"></span>
      <button class="landingPageSection__link">
        <a href="javascript:;" v-if="linkUrl" @click="$emit('click')">看更多</a>
        <span class="landingPageSection__moreIcon" v-if="linkUrl"></span>
      </button>
    </div>
    <div class="landingPageSection__tabs" v-if="hasTabs">
      <slot name="tabs"></slot>
    </div>
    <div class="landingPageSection__body">
      <slot></slot>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'

@Component
export default class LandingPageSection extends Vue {
  @Prop({
    type: String,
    default() {
      return ''
    }
  })
  readonly title!: string

  @Prop({
    type: Boolean,
    default() {
      return false
    }
  })
  readonly hasNew!: boolean

  @Prop({
    type: Boolean,
    default() {
      return false
    }
  })
  readonly hasTabs!: boolean

  @Prop({
    type: String,
    default() {
      return ''
    }
  })
  readonly iconUrl!: string

  @Prop({
    type: String,
    default() {
      return ''
    }
  })
  readonly linkUrl!: string
}
</script>
<style lang="scss" scoped>
@import '../assets/scss/utils/variables';
@import '../assets/scss/utils/media';

.landingPageSection {
  border: 1px solid #fff;
  border-radius: 4px;
  background-color: #fff;
  &__banner {
    display: flex;
    align-items: center;
    padding: $spacing-l;
    border-bottom: 1px solid $whiteFour;
  }
  &__body {
    padding: $spacing-s;
    @include grid-md {
      padding: $spacing-l;
    }
  }
  &__icon {
    width: 26px;
    height: 26px;
    background-position: center center;
    background-size: cover;
  }
  &__title {
    font-size: $fz-m;
    font-weight: bold;
    margin-left: $spacing-l;
  }
  &__newIcon {
    width: 46px;
    height: 20px;
    margin-left: $spacing-l;
    background-image: url(/img/icon_new.svg);
  }
  &__link {
    display: flex;
    align-items: center;
    margin-left: auto;
    color: $greySix;
    font-weight: bold;
    cursor: pointer;
    border: none;
    background-color: transparent;
    > a {
      color: $greySix;
    }
  }
  &__moreIcon {
    display: block;
    width: 12px;
    height: 12px;
    margin-left: $spacing-m;
    background-image: url(/img/icon_more.svg);
  }
  &__tabs {
    height: 50px;
    width: 100%;
    border-bottom: 1px solid $whiteFour;
  }
}
</style>
