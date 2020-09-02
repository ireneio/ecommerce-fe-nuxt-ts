<template>
  <div class="defaultVisitStore">
    <b-container fluid>
      <b-row>
        <b-col cols="24" class="px-0">
          <slot></slot>
        </b-col>
        <b-col cols="24">
          <div class="defaultVisitStore__body">
            <slot name="body"></slot>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'

@Component
export default class VisitStoreContainer extends Vue {}
</script>
<style lang="scss" scoped>
@import '../assets/scss/utils/variables';

.defaultVisitStore {
  border: 1px solid $greyOne;
  &__body {
    padding: $spacing-xs 0 $spacing-xxl 0;
  }
}
</style>
