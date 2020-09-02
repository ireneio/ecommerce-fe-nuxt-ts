<template>
  <div
    class="defaultMask"
    :class="{ 'defaultMask--active': active }"
    :style="{ top: `calc(${centerFromWindow.toString()}px)` }"
  ></div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'nuxt-property-decorator'

@Component
export default class DefaultMask extends Vue {
  @Prop({
    type: Boolean,
    default() {
      return false
    }
  })
  readonly active!: boolean

  @Watch('active')
  OnActiveChange(val: boolean) {
    const body: any = document.querySelector('body')
    if (val) body.style.overflow = 'hidden'
    else body.style.overflow = 'auto'
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

.defaultMask {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  overflow: auto;
  z-index: -1;
  opacity: 0;
  background-color: rgba(0, 0, 0, 0.3);
  &--active {
    z-index: 999;
    opacity: 1;
    overflow: hidden;
  }
}
</style>
