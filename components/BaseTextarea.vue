<template>
  <span>
    <textarea
      :type="type"
      :id="id ? id : null"
      class="input__text"
      :value="value"
      :disabled="readonly || disabled"
      cols="10"
      rows="5"
      :class="[
        {
          'input__text--warning': !valid && isFocused,
          'input__text--primary': isFocused,
          'input__text--readonly': readonly
        }
      ]"
      :placeholder="placeholder"
      @input="handleInput"
      @blur="handleBlur"
      @focus="handleFocus"
    ></textarea>
    <span class="input__icon">
      <slot name="icon"></slot>
    </span>
  </span>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'

@Component
export default class BaseInput extends Vue {
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
  readonly valid!: boolean

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
  readonly value!: string

  public isFocused: Boolean = false

  handleInput(e: any) {
    this.$emit('input', e.target.value)
  }

  handleFocus(e: any) {
    this.isFocused = true
    this.$emit('focus')
  }

  handleBlur(e: any) {
    this.isFocused = false
    this.$emit('blur')
  }
}
</script>
<style lang="scss" scoped>
@import '../assets/scss/utils/variables';

.input {
  width: 100%;
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
