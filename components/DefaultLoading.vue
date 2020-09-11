<template>
  <div v-if="loading" class="loading">
    <p>
      <!-- <fa :icon="['fas', 'spinner', 'spin']"></fa> -->
      <!-- <span class="loading__bar"></span> -->
      <!-- <span>{{ percent }}...</span> -->
    </p>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class DefaultLoading extends Vue {
  public loading: boolean = false

  public percent: number = 0

  public start(): void {
    this.loading = true
  }

  public finish(): void {
    this.loading = false
  }

  public increase(num: number): void {
    this.percent = num
    // if (process.client) {
    // const dom: any = document.querySelector('.loading__bar')
    // const percent = (num / 3).toString()
    // dom.style.width = percent + '%'
    // }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/utils/variables';

.loading {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 3000;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.95);
  > p {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 50px;
    background-image: url(/img/spinner.gif);
    background-size: contain;
    background-position: center center;
    background-repeat: no-repeat;
    width: 300px;
    height: 300px;
    > span {
      display: block;
      margin-top: 200px;
      height: 5px;
      background-color: $primary;
      border-radius: 200px;
    }
  }
}
</style>
