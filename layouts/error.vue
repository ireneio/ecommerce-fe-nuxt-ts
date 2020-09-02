<template>
  <div>
    <b-container>
      <b-row>
        <b-col cols="24" class="px-0">
          <main class="error">
            <div class="error__image"></div>
            <div class="error__text">
              <p class="error__title">Sorry!</p>
              <p class="error__content">
                系統在<span class="error__timer">{{ count }}</span
                >秒後會自動導向<br />
                若有任何疑問，請聯絡STAYFUN網站客服<br />
                客服專線:<span class="error__timer">(02) 6617-7100</span>
              </p>
            </div>
          </main>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'

@Component({
  layout: 'error'
})
export default class ErrorLayout extends Vue {
  public timer: any = ''
  public count: number = 0

  public mounted() {
    this.count = 7
    this.timer = setInterval(() => {
      this.count -= 1
      if (this.count === 0) {
        this.$router.push('/')
        this.timer = null
      }
    }, 1000)
  }

  public beforeDestroy() {
    this.timer = null
  }
}
</script>
<style lang="scss" scoped>
@import '../assets/scss/utils/variables';
@import '../assets/scss/utils/media';

.error {
  display: flex;
  flex-wrap: wrap;
  margin: 0 auto;
  background-color: #fff;
  height: 300px;
  width: 100%;
  justify-content: center;
  align-items: center;
  @include grid-lg {
    height: 80vh;
  }
  &__image {
    display: none;
    flex: 0 0 100%;
    height: 500px;
    max-width: 100%;
    background-size: contain;
    background-position: center center;
    background-image: url(/img/ic_pageerror.png);
    background-repeat: no-repeat;
    @include grid-lg {
      flex: 0 0 50%;
      display: block;
    }
  }
  &__text {
    flex: 0 0 100%;
    font-weight: bold;
    font-size: $fz-m;
    padding: 0 $spacing-xxl;
    @include grid-lg {
      flex: 0 0 50%;
    }
  }
  &__title {
    color: $primary;
    font-size: $fz-xxl;
  }
  &__content {
    margin-top: $spacing-xl;
    line-height: 2;
  }
  &__timer {
    display: inline-block;
    padding: 0 $spacing-xs;
    color: $orangeDark;
  }
}
</style>
