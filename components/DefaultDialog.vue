<template>
  <div
    class="defaultDialog"
    :class="{ 'defaultDialog--active': active }"
    :style="{ top: `calc(50% + ${centerFromWindow.toString()}px)` }"
  >
    <div class="defaultDialog__icon"></div>
    <p class="defaultDialog__title" v-if="icon">
      <img
        src="/img/icon-oops@3x.png"
        alt="warning icon"
        width="48px"
        height="48px"
      />
    </p>
    <p class="defaultDialog__title" v-if="title === 'qrcode'">
      <img
        src="https://hnstayfunuat.blob.core.windows.net/store/stayfun_qr_code.png"
        alt="stayfun qr code"
        width="150px"
        height="150px"
      />
    </p>
    <p class="defaultDialog__title" v-if="title !== 'qrcode'">{{ title }}</p>
    <p class="defaultDialog__content">{{ message }}</p>
    <div class="defaultDialog__btnbox">
      <button
        class="defaultDialog__btn defaultDialog__btn--greyTwo defaultDialog__btn--left"
        @click="$emit('cancel')"
        v-if="type === 'confirm'"
      >
        取消
      </button>
      <button
        class="defaultDialog__btn defaultDialog__btn--primary defaultDialog__btn--right"
        @click="$emit('confirm')"
        v-if="type === 'confirm'"
      >
        確定
      </button>
      <button
        class="defaultDialog__btn defaultDialog__btn--primary defaultDialog__btn--single"
        @click="$emit('accept')"
        v-if="type === 'accept'"
      >
        關閉
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'nuxt-property-decorator'

@Component
export default class LandingPageNewsItem extends Vue {
  @Prop({
    type: String,
    default() {
      return 'confirm'
    }
  })
  readonly type!: 'confirm' | 'accept'

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
      return 'Placeholder Content'
    }
  })
  readonly message!: string

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
      return false
    }
  })
  readonly icon!: boolean

  private centerFromWindow: number = 0

  private handleScroll() {
    if (process.client) this.centerFromWindow = window.scrollY
  }

  private created() {
    if (process.client) {
      this.centerFromWindow = window.scrollY
    }
  }

  private mounted() {
    window.addEventListener('scroll', this.handleScroll)
  }

  private beforeDestroyed() {
    window.removeEventListener('scroll', this.handleScroll)
  }
}
</script>
<style lang="scss" scoped>
@import '../assets/scss/utils/variables';
@import '../assets/scss/utils/media';

.defaultDialog {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: -1;
  opacity: 0;
  min-height: 230px;
  max-height: 90vh;
  width: 90vw;
  overflow: auto;
  transition: opacity 0.3s;
  @include grid-sm {
    max-height: 50vh;
    width: 400px;
  }
  background-color: #fff;
  padding-top: 25px;
  padding-bottom: 44px + $spacing-m;
  border-radius: 8px;
  &--active {
    z-index: 1000;
    opacity: 1;
  }
  &__title {
    color: $greyThree;
    font-size: $fz-l;
    text-align: center;
    padding: 14px $spacing-xl;
    font-weight: bold;
  }
  &__content {
    font-size: $fz-s;
    text-align: center;
    color: $black;
    padding: 0 $spacing-xl;
    margin: 14px 0;
    max-height: 200px;
    overflow: auto;
    font-weight: normal;
  }
  &__btnbox {
    display: flex;
    position: absolute;
    bottom: 0;
    width: 100%;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
  }
  &__btn {
    flex: 1 0 auto;
    min-width: 50%;
    border: none;
    padding: 10px;
    letter-spacing: 1.5;
    font-size: $fz-m;
    text-align: center;
    &--greyTwo {
      background-color: $greyTwo;
      color: #fff;
      border-bottom-left-radius: 8px;
    }
    &--primary {
      background-color: $primary;
      color: #fff;
      border-bottom-right-radius: 8px;
    }
    &--single {
      border-bottom-left-radius: 8px;
      border-bottom-right-radius: 8px;
    }
    &--left {
      border-bottom-left-radius: 8px;
    }
    &--right {
      border-bottom-right-radius: 8px;
    }
  }
}
</style>
