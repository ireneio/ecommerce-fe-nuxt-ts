<template>
  <button
    :disabled="disabled"
    @click="$emit('click')"
    class="button"
    :class="[
      `button--${type}`,
      {
        'button--block': display === 'block',
        'button--large': size === 'l'
      }
    ]"
  >
    <slot></slot>
  </button>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'

@Component
export default class BaseButton extends Vue {
  @Prop({
    type: String,
    default() {
      return 'primary'
    }
  })
  readonly type!: string

  @Prop({
    type: String,
    default() {
      return 'inline'
    }
  })
  readonly display!: string

  @Prop({
    type: String,
    default() {
      return 'm'
    }
  })
  readonly size!: string

  @Prop({
    type: Boolean,
    default() {
      return false
    }
  })
  readonly disabled!: boolean
}
</script>
<style lang="scss" scoped>
@import '../assets/scss/utils/variables';

.button {
  border-radius: 4px;
  font-weight: bold;
  line-height: 1;
  padding: 0.75rem 1.56rem;
  outline: none;
  border-style: solid;
  width: auto;
  font-size: $fz-m;
  &:focus {
    border: 2px solid rgba($color: $secondary, $alpha: 0.7);
  }
  &--large {
    font-size: 1.25rem;
    letter-spacing: $spacing-xs;
  }
  &--primaryOutline {
    color: $primary;
    background-color: #fff;
    border-color: $primary;
    border-width: 1px;
    &:hover {
      background-color: $primary;
      color: #fff;
    }
  }
  &--primary {
    color: #fff;
    background-color: $primary;
    border-color: $primary;
    border-width: 1px;
    &:hover {
      background-color: $lightOrange;
      border-color: $lightOrange;
    }
  }
  &--orangeDark {
    color: #fff;
    background-color: $orangeDark;
    border-color: $orangeDark;
    border-width: 1px;
    &:hover {
      background-color: $primary;
      border-color: $primary;
    }
  }
  &--greyOne {
    color: #fff;
    background-color: $greyOne;
    border-color: $greyOne;
    border-width: 1px;
  }
  &--greyTwo {
    color: #fff;
    background-color: $greyTwo;
    border-color: $greyTwo;
    border-width: 1px;
    &:hover {
      background-color: $greyThree;
    }
  }
  &--greyTwoOutline {
    color: $greyTwo;
    background-color: #fff;
    border-color: $greyTwo;
    border-width: 1px;
    &:hover {
      color: $greyThree;
    }
  }
  &--block {
    display: block;
    width: 100%;
  }
}
</style>
