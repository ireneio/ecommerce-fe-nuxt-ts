<template>
  <div class="searchbar">
    <input
      type="text"
      name=""
      id=""
      :placeholder="placeholder"
      @input="
        ;(value = $event.target.value), $emit('input', $event.target.value)
      "
      @blur="$emit('blur', $event.target.value)"
      @keydown.enter="$emit('keydown-enter', $event.target.value)"
    />
    <fa
      :icon="['fas', 'search']"
      class="searchbar__searchicon"
      @click="$emit('click', value)"
    ></fa>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'

@Component
export default class DefaultSearchBar extends Vue {
  @Prop({
    type: String,
    default() {
      return ''
    }
  })
  readonly placeholder!: string

  public value: string = ''
}
</script>
<style lang="scss" scoped>
@import '../assets/scss/utils/variables';

.searchbar {
  position: relative;
  display: flex;
  align-items: center;
  > input {
    border: 1px solid $whiteOne;
    border-radius: 4px;
    padding: $spacing-s $spacing-m;
    width: 100%;
  }
  &__searchicon {
    position: absolute;
    right: $spacing-m;
    font-size: $fz-xl;
    color: $greyThree;
    cursor: pointer;
    &:hover {
      color: $primary;
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
</style>
