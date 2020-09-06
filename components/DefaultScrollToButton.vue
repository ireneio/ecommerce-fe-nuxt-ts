<template>
  <button
    @click="handleClick"
    class="scrollToButton"
    :style="{ top: `calc(87% + ${centerFromWindow.toString()}px)` }"
    v-show="centerFromWindow > 500"
  >
    <fa :icon="['fas', 'arrow-up']"></fa>
  </button>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'

@Component
export default class DefaultScrollToButton extends Vue {
  public handleClick(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  public centerFromWindow: number = 0

  public handleScroll() {
    if (process.client) this.centerFromWindow = window.scrollY
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

.scrollToButton {
  position: absolute;
  z-index: 5;
  right: 8%;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border: 2px solid $primary;
  color: $primary;
  background-color: #fff;
  transition: opacity 0.3s;
}
</style>
