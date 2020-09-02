<template>
  <div class="defaultMain">
    <div class="defaultMain__container">
      <b-container fluid>
        <b-row>
          <b-col cols="24" lg="6" class="px-0">
            <aside class="defaultMain__aside">
              <h2
                class="defaultMain__title"
                :style="{ cursor: clickableTitle ? 'pointer' : 'allowed' }"
                @click="handleClickTitle"
              >
                <fa
                  :icon="['fas', 'chevron-left']"
                  class="defaultMain__icon"
                  v-if="clickableTitle"
                ></fa>
                {{ title }}
              </h2>
            </aside>
          </b-col>
          <b-col cols="24" lg="18" :class="{ 'px-0': dark }">
            <main
              class="defaultMain__main"
              :class="{ 'defaultMain__main--dark': dark }"
            >
              <slot></slot>
            </main>
          </b-col>
        </b-row>
      </b-container>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'

@Component
export default class DefaultMainContainer extends Vue {
  @Prop({
    type: String,
    default() {
      return ''
    }
  })
  readonly title!: String

  @Prop({
    type: Boolean,
    default() {
      return false
    }
  })
  readonly dark!: Boolean

  @Prop({
    type: Boolean,
    default() {
      return false
    }
  })
  readonly clickableTitle!: Boolean

  @Prop({
    type: String,
    default() {
      return ''
    }
  })
  readonly route!: string

  handleClickTitle(): void {
    if (this.clickableTitle && this.route !== '') {
      this.$router.push({ name: this.route })
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../assets/scss/utils/variables';
@import '../assets/scss/utils/media';

.defaultMain {
  position: relative;
  min-height: 70vh;
  &__container {
    width: 100%;
    box-shadow: 0 0px 5px 0 rgba(0, 0, 0, 0.25);
  }
  &__aside {
    height: 100%;
    background-color: $greyFour;
    padding-bottom: $spacing-m;
  }
  &__main {
    padding: 55px $spacing-m;
    color: $greyThree;
    font-weight: normal;
    height: 100%;
    @include grid-md {
      padding: 55px;
    }
    &--dark {
      background-color: $greyFour;
    }
  }
  &__title {
    padding: $spacing-xxl $spacing-xxl 0 $spacing-xxl;
    color: $orange;
    font-weight: bold;
    font-size: $fz-xxl;
    text-align: left;
    @include grid-md {
      padding: 55px 50px;
    }
    @include grid-lg {
      text-align: right;
    }
  }
  &__icon {
    font-size: $fz-m;
  }
}
</style>
