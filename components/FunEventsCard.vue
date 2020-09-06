<template>
  <div class="funEventsCard">
    <div class="funEventsCard__imgbox">
      <span class="funEventsCard__pin" v-if="value.isSticky">
        <fa :icon="['fas', 'thumbtack']"></fa>
      </span>
      <div
        class="funEventsCard__img"
        :style="{ 'background-image': `url(${valueReformatForImageUrl.imageUrl})` }"
      ></div>
    </div>
    <div class="funEventsCard__text">
      <div class="funEventsCard__badge" v-if="valueReformatForImageUrl.isNew">new</div>
      <h3 class="funEventsCard__title">{{ valueReformatForImageUrl.name }}</h3>
      <p
        class="funEventsCard__date"
      >{{ `${valueReformatForImageUrl.startDateTime} ~ ${valueReformatForImageUrl.endDateTime}` }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'

interface FunEventsCardProps {
  imageUrl: string
  name: string
  endDateTime: string
  startDateTime: string
  serialno: string
  type?: string
  isSticky: boolean
  isNew: boolean
}

@Component
export default class FunEventsCard extends Vue {
  @Prop({
    type: Object,
    default() {
      return {}
    }
  })
  readonly value!: FunEventsCardProps

  get valueReformatForImageUrl() {
    return {
      ...this.value,
      imageUrl:
        this.value.imageUrl === '' || this.value.imageUrl === null
          ? '/img/store_preparing.jpg'
          : this.value.imageUrl
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../assets/scss/utils/variables';

.funEventsCard {
  padding: $spacing-m;
  width: 100%;
  height: 450px;
  box-shadow: 0px 2px 8px 5px rgba($color: #000000, $alpha: 0.1);
  cursor: pointer;
  &__badge {
    border-radius: 40px;
    background-color: $primary;
    color: #fff;
    font-size: $fz-xs;
    padding: 2px $spacing-s;
    width: 40px;
    margin-bottom: $spacing-s;
  }
  &__imgbox {
    position: relative;
    overflow: hidden;
    height: 300px;
  }
  &__img {
    height: 300px;
    background-position: center center;
    background-size: cover;
    transition: transform 0.3s;
  }
  &__text {
    padding: $spacing-m 0;
  }
  &__title {
    font-size: $fz-s;
    font-weight: bold;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    color: $greyThree;
  }
  &__date {
    position: absolute;
    bottom: $spacing-m;
    font-size: $fz-xs;
    color: $greyTwo;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  &__pin {
    position: absolute;
    right: $spacing-xs;
    top: $spacing-xs;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    width: 25px;
    height: 25px;
    background-color: rgba($color: $greyTwo, $alpha: 0.2);
    color: $primary;
    transform: rotate(45deg);
  }
  &:focus,
  &:hover {
    box-shadow: 0 0 7px 3px rgba(0, 0, 0, 0.1);
    .funEventsCard__img {
      transform: scale(1.3);
    }
  }
}
</style>
