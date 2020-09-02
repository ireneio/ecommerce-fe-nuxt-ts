<template>
  <label class="input">
    <label
      :for="id"
      :class="{
        'input__checkbox--checked': checked,
        input__checkbox: type === 'checkbox',
        input__radio: type === 'radio'
      }"
    >
      <fa
        :icon="['fas', 'check']"
        class="input__checkmark"
        v-show="checked && type === 'checkbox'"
      />
      <span class="input__boxmark" v-show="checked && type === 'radio'"></span>
    </label>
    <input
      :type="type"
      :name="name"
      class="input__ogBox"
      :id="id"
      :value="value"
      :checked="checked"
      @input="handleInput"
    />
    <label class="input__text" :for="id">
      <slot></slot>
    </label>
  </label>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'nuxt-property-decorator'

@Component
export default class BaseCheckbox extends Vue {
  @Prop({
    default() {
      return null
    }
  })
  readonly value!: any

  @Prop({
    type: String,
    default() {
      return ''
    }
  })
  readonly id!: string

  @Prop({
    type: String,
    default() {
      return ''
    }
  })
  readonly name!: string

  @Prop({
    type: String,
    default() {
      return 'checkbox'
    }
  })
  readonly type!: string

  public checked: boolean = false

  handleInput(e: any) {
    if (
      e.target.value &&
      e.target.value !== 'false' &&
      e.target.value !== 'true'
    ) {
      this.checked = true
      this.$emit('input', e.target.value)
    } else {
      if (e.target.checked) {
        this.checked = true
      } else {
        this.checked = false
      }
      this.$emit('input', e.target.checked)
    }
  }

  @Watch('value', { immediate: true })
  onValueChange(newVal: any) {
    this.checked = newVal
  }
}
</script>
<style lang="scss" scoped>
@import '../assets/scss/utils/variables';

.input {
  display: flex;
  align-items: center;
  &__ogBox {
    display: none;
  }
  &__checkbox {
    border: 1px solid $greyTwo;
    width: 14px;
    height: 14px;
    cursor: pointer;
    &--checked {
      border-color: $primary;
    }
  }
  &__radio {
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid $greyTwo;
    border-radius: 50%;
    width: 16px;
    height: 16px;
    cursor: pointer;
    &--checked {
      border-color: $primary;
    }
  }
  &__boxmark {
    display: block;
    width: 10px;
    height: 10px;
    background-color: $primary;
    border-radius: 50%;
  }
  &__checkmark {
    font-size: 0.75rem;
    color: $primary;
    margin-bottom: $spacing-xs;
  }
  &__text {
    margin-left: $spacing-xs;
    color: $greyTwo;
    font-size: 0.875rem;
    cursor: pointer;
  }
}
</style>
