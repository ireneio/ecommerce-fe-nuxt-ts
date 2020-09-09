<template>
  <div
    class="defaultModal"
    :class="{ 'defaultModal--active': active }"
    :style="{ top: `calc(50% + ${centerFromWindow.toString()}px)` }"
  >
    <span
      class="defaultModal__btn"
      @click="$emit('click')"
      v-show="button"
    ></span>
    <div class="defaultModal__title">
      <slot name="title"></slot>
    </div>
    <slot></slot>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'nuxt-property-decorator'

@Component
export default class DefaultModal extends Vue {
  @Prop({
    type: Boolean,
    default() {
      return false
    }
  })
  readonly active!: boolean

  @Prop({
    type: Boolean,
    default() {
      return true
    }
  })
  readonly button!: boolean

  public centerFromWindow: number = 0

  public handleScroll() {
    if (process.client) this.centerFromWindow = window.scrollY
  }

  private created() {
    if (process.client) {
      this.centerFromWindow = window.scrollY
    }
  }

  public mounted() {
    window.addEventListener('scroll', this.handleScroll)
  }

  public beforeDestroyed() {
    window.removeEventListener('scroll', this.handleScroll)
  }
}
</script>
<style lang="scss" scoped>
@import '../assets/scss/utils/variables';
@import '../assets/scss/utils/media';

.defaultModal {
  position: absolute;
  top: 0%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: -1;
  opacity: 0;
  min-height: 230px;
  max-height: 90vh;
  width: 90vw;
  overflow: auto;
  background-color: #fff;
  padding: $spacing-s $spacing-xl;
  border-radius: 8px;
  @include grid-md {
    padding: 42px 85px 53px;
  }
  @include grid-lg {
    width: 50vw;
    transform: translate(-50%, -50%);
  }
  &--active {
    z-index: 1000;
    opacity: 1;
  }
  &__btn {
    position: absolute;
    right: 20px;
    top: 20px;
    cursor: pointer;
    background-image: url(/img/ic-close.png);
    background-size: cover;
    background-position: center center;
    width: 24px;
    height: 24px;
  }
  &__title {
    padding-bottom: $spacing-xl;
  }
}
</style>
