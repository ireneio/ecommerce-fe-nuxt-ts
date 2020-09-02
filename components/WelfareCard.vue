<template>
  <a href="javascript:;" @click="$emit('click')">
    <div class="welfareCard">
      <h5 class="welfareCard__title">{{ title }}</h5>
      <h6 class="welfareCard__subtitle">{{ serialno }}</h6>
    </div>
  </a>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'

@Component
export default class WelfareCard extends Vue {
  @Prop({
    type: String,
    default() {
      return ''
    }
  })
  readonly serialno!: String

  @Prop({
    type: String,
    default() {
      return ''
    }
  })
  readonly title!: String
}
</script>
<style lang="scss" scoped>
@import '../assets/scss/utils/variables';

.welfareCard {
  border: 1px solid $whiteOne;
  padding: $spacing-xl;
  background-color: #fff;
  border-radius: 4px;
  &:hover {
    box-shadow: 0px 0px 7px 7px rgba(0, 0, 0, 0.1);
  }
  &__title {
    color: $greyThree;
    margin-bottom: $spacing-xxl;
    font-weight: bold;
  }
  &__subtitle {
    color: $greyTwo;
    font-weight: bold;
  }
}
</style>
