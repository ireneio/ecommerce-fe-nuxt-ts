<template>
  <span class="baseFile">
    <label
      :for="id"
      class="baseFile__text"
      :class="{ 'input__text--placeholder': filename === '' }"
      >{{ filename !== '' ? filename : placeholder }}

      <input
        :id="id"
        type="file"
        class="baseFile__file"
        @change="handleFileSelect"
        multiple
      />
    </label>
    <span class="baseFile__icon">
      <slot name="icon"></slot>
    </span>
    <label class="baseFile__btn" :for="id">
      <BaseButton type="primaryOutline" display="block">
        <label :for="id" class="baseFile__btnlabel">上傳附件</label>
      </BaseButton>
    </label>
    <p class="baseFile__helper">
      2M 以下，格式限定 pdf、doc、docx、xls、xlsx、jpg、jpeg、png、gif
    </p>
  </span>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import { v4 as uuidv4 } from 'uuid'
import BaseButton from '~/components/BaseButton.vue'

interface Hint {
  text: string
  type: string
}
@Component
export default class BaseFile extends Vue {
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
  readonly reminder!: string

  public filename: String = ''

  handleFileSelect(e: any) {
    const arr: Array<any> = Array.from(e.target.files)
    if (arr.length === 1) this.filename = arr[0].name
    else this.filename = `${arr[0].name} 和其他 ${arr.length - 1} 個檔案`
    this.$emit('change', arr)
  }
}
</script>
<style lang="scss" scoped>
@import '../assets/scss/utils/variables';
@import '../assets/scss/utils/media';

.baseFile {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  &__icon {
    position: absolute;
    right: 2%;
    bottom: 25%;
  }
  &__text {
    flex: 0 0 100%;
    margin-right: $spacing-m;
    cursor: pointer;
    outline: none;
    border: none;
    border-bottom: 1px solid $greyTwo;
    color: #000;
    padding: 10px 0;
    padding-left: 2px;
    font-size: $fz-m;
    @include grid-md {
      flex: 1 1 65%;
    }
    & [type='file'] {
      display: none;
    }
    &--placeholder {
      color: $whiteOne;
      font-size: $fz-m;
      font-weight: bold;
    }
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
  &__btn {
    flex: 0 0 100%;
    margin-top: $spacing-m;
    cursor: pointer;
    margin-left: auto;
    @include grid-md {
      flex: 1 1 32%;
      margin-top: 0;
    }
  }
  &__helper {
    font-size: $fz-xs;
    color: $greyTwo;
    font-weight: bold;
  }
  &__btnlabel {
    display: inline;
    width: 100%;
    height: 100%;
    cursor: pointer;
    padding: 0.75rem 1.56rem;
  }
}

:disabled {
  background-color: transparent;
}
</style>
