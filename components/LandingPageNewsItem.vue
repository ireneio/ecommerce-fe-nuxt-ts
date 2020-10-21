<template>
  <div class="landingPageNewsItem" @click="$emit('click')">
    <h4 class="landingPageNewsItem__title">{{ text }}</h4>
    <span class="landingPageNewsItem__date">{{ date }}</span>
    <span class="landingPageNewsItem__author">
      <span class="landingPageNewsItem__authoricon"></span>
      <span> {{ name }}</span>
    </span>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'

@Component
export default class LandingPageNewsItem extends Vue {
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
  readonly date!: string

  @Prop({
    type: String,
    default() {
      return ''
    }
  })
  readonly name!: string
}
</script>
<style lang="scss" scoped>
@import '../assets/scss/utils/variables';
@import '../assets/scss/utils/media';

.landingPageNewsItem {
  display: flex;
  flex-wrap: wrap;
  cursor: pointer;
  padding: $spacing-m 0;
  border-bottom: 1px solid $whiteFour;
  &--last {
    padding-bottom: 0;
    border-bottom-color: transparent;
  }
  &__title,
  &__date,
  &__author {
    font-size: $fz-s;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  &__title {
    flex: 0 0 100%;
    color: $greySeven;
    margin-bottom: $spacing-s;
    @include grid-md {
      flex: 0 0 50%;
    }
  }
  &__date {
    flex: 0 0 50%;
    color: $greySix;
    @include grid-md {
      flex: 0 0 25%;
      text-align: right;
    }
  }
  &__author {
    flex: 0 0 50%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    color: $greySeven;
    @include grid-md {
      flex: 0 0 25%;
    }
  }
  &__authoricon {
    height: 13px;
    width: 13px;
    background-image: url(/img/icon_tabbar_selected_home.svg);
    background-position: center center;
    background-size: cover;
    margin-right: $spacing-xs;
  }
}
</style>
