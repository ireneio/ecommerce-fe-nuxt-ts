<template>
  <label
    for=""
    class="input__text"
    :class="[
      {
        'input__text--warning': !valid,
        'input__text--primary': isFocused
      }
    ]"
  >
    <v-select
      :options="options"
      :clearable="false"
      @input="handleInput"
      @search:blur="handleBlur"
      @search:focus="handleFocus"
      :reduce="(option) => option.value"
      :placeholder="placeholder"
      :value="value"
      :selectable="selectable"
    >
    </v-select>
  </label>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import vSelect from 'vue-select'

interface Option {
  label: string
  value: string | number
  id: string
}

@Component({
  components: { 'v-select': vSelect }
})
export default class BaseSelect extends Vue {
  @Prop({
    type: Function,
    default() {
      return (option: Option) => option
    }
  })
  readonly selectable!: Function

  @Prop({
    type: Array,
    default() {
      return []
    }
  })
  readonly options!: Array<Option>

  @Prop({
    type: Boolean,
    default() {
      return false
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
    default() {
      return ''
    }
  })
  readonly value!: string | number

  public isFocused: Boolean = false

  handleInput(val: any) {
    this.$emit('input', val)
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
  &__text {
    outline: none;
    border: none;
    border-bottom: 1px solid $greyTwo;
    color: #000;
    padding: 10px 0;
    width: 100%;
    padding-left: 2px;
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
  font-size: 1rem;
  font-weight: bold;
}

:-ms-input-placeholder {
  /* Internet Explorer */
  color: $whiteOne;
  font-size: 1rem;
  font-weight: bold;
}

::placeholder {
  color: $whiteOne;
  font-size: 1rem;
  font-weight: bold;
}
</style>
