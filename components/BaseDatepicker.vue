<template>
  <label for class="input">
    <date-picker
      class="baseDatepicker"
      @input="$emit('input', $event)"
      :value="value"
      value-type="format"
      :format="format"
      prefix-class="xmx"
      :disabled-date="disabledDates"
      :disabled="disabled"
    ></date-picker>
  </label>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import DatePicker from 'vue2-datepicker'

@Component({
  components: {
    DatePicker
  }
})
export default class BaseDatepicker extends Vue {
  @Prop({
    type: Function,
    default() {
      return ''
    }
  })
  readonly disabledDates!: Function

  @Prop({
    type: String,
    default() {
      return ''
    }
  })
  readonly value!: string

  @Prop({
    type: String,
    default() {
      return ''
    }
  })
  readonly format!: string

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

.input {
  width: 100%;
  padding: 10px 0;
  padding-left: 2px;
}

.baseDatepicker {
  width: 100%;
}
</style>
