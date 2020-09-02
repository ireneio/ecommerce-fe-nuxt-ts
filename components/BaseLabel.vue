<template>
  <label class="input">
    <label class="input__label" :for="id">
      {{ text }}
      <span class="input__required" v-if="required"></span>
    </label>
    <div class="input__textBox" :style="{ flex: `0 0 ${width}%` }">
      <slot></slot>
      <span class="input__icon">
        <slot name="icon"></slot>
      </span>
    </div>
    <div class="input__hint" :class="`input__hint--${hint.type}`">
      <span v-show="!valid && !isFocused">{{ hint.text }}</span>
    </div>
  </label>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'

interface Hint {
  text: string
  type: string
}
@Component
export default class BaseLabel extends Vue {
  @Prop({
    type: Object,
    default() {
      return {}
    }
  })
  readonly hint!: Hint

  @Prop({
    type: Boolean,
    default() {
      return true
    }
  })
  readonly valid!: boolean

  @Prop({
    type: String,
    default() {
      return ''
    }
  })
  readonly placeholder!: string

  @Prop({
    type: String,
    default() {
      return 'text'
    }
  })
  readonly type!: string

  @Prop({
    type: String,
    default() {
      return ''
    }
  })
  readonly id!: string

  @Prop({
    type: Boolean,
    default() {
      return false
    }
  })
  readonly required!: boolean

  @Prop({
    type: Boolean,
    default() {
      return false
    }
  })
  readonly readonly!: boolean

  @Prop({
    type: Boolean,
    default() {
      return false
    }
  })
  readonly disabled!: boolean

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
      return '100'
    }
  })
  readonly width!: string

  public isFocused: Boolean = false
}
</script>
<style lang="scss" scoped>
@import '../assets/scss/utils/variables';

.input {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  &__label {
    display: flex;
    align-items: center;
    color: $greyTwo;
    font-weight: bold;
  }
  &__required {
    margin-left: $spacing-s;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background-color: $orangeDark;
  }
  &__hint {
    height: 20px;
    width: 100%;
    font-weight: bold;
    text-align: left;
    &--warning {
      color: $warning;
    }
  }
  &__textBox {
    position: relative;
  }
  &__icon {
    position: absolute;
    right: 2%;
    bottom: 25%;
  }
  &__text {
    outline: none;
    border: none;
    border-bottom: 1px solid $greyTwo;
    color: #000;
    padding: 10px 0;
    width: 100%;
    padding-left: 2px;
    font-size: $fz-m;
    &--warning {
      border-bottom-color: $warning;
    }
    &--primary {
      border-bottom-color: $primary;
    }
    &--readonly {
      border: 1px solid transparent;
    }
  }
}

::-webkit-input-placeholder {
  /* Edge */
  color: $whiteOne;
  font-size: $fz-m;
  font-weight: bold;
}

:-ms-input-placeholder {
  /* Internet Explorer */
  color: $whiteOne;
  font-size: $fz-m;
  font-weight: bold;
}

::placeholder {
  color: $whiteOne;
  font-size: $fz-m;
  font-weight: bold;
}
:disabled {
  background-color: transparent;
}
</style>
