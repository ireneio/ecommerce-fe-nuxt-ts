<template>
  <a href="javascript:;" class="landingPageCard" @click="$emit('click')">
    <div class="landingPageCard__img" :style="{ 'background-image': `url(${detail.imageUrl})` }"></div>
    <div class="landingPageCard__desc">
      <p class="landingPageCard__notif" v-if="hasNotif || hasNotifIcon">
        <span class="landingPageCard__notifIcon" v-if="hasNotifIcon"></span>
        <span v-if="hasNotif">{{ detail.description }}</span>
      </p>
      <h3 class="landingPageCard__title">{{ detail.name }}</h3>
      <h4 class="landingPageCard__subtitle" v-if="hasSubtitle">{{ detail.description }}</h4>
      <div class="landingPageCard__info">
        <div class="landingPageCard__priceSection">
          <p class="landingPageCard__distance" v-if="hasDistance">2.65km</p>
          <p class="landingPageCard__priceCross" v-if="hasPriceCross">$130</p>
          <p class="landingPageCard__price" v-if="hasPrice">
            <span>$</span>
            <span>{{ detail.price }}</span>
            <span v-if="hasPriceIncrease">起</span>
          </p>
        </div>
        <div class="landingPageCard__btnbox" v-if="hasButton">
          <base-button type="orangeDark">立即開團</base-button>
        </div>
        <div class="landingPageCard__like" v-if="hasLike"></div>
      </div>
    </div>
  </a>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import BaseButton from '~/components/BaseButton.vue'

interface Card {
  imageUrl: string
  description: string
  name: string
  url: string
  price?: string
}

@Component
export default class LandingPageCard extends Vue {
  @Prop({
    type: Object,
    default() {
      return {}
    }
  })
  readonly detail!: Card

  @Prop({
    type: Boolean,
    default() {
      return false
    }
  })
  readonly hasNotif!: boolean

  @Prop({
    type: Boolean,
    default() {
      return false
    }
  })
  readonly hasNotifIcon!: boolean

  @Prop({
    type: Boolean,
    default() {
      return false
    }
  })
  readonly hasDistance!: boolean

  @Prop({
    type: Boolean,
    default() {
      return false
    }
  })
  readonly hasPriceCross!: boolean

  @Prop({
    type: Boolean,
    default() {
      return false
    }
  })
  readonly hasPrice!: boolean

  @Prop({
    type: Boolean,
    default() {
      return false
    }
  })
  readonly hasPriceIncrease!: boolean

  @Prop({
    type: Boolean,
    default() {
      return false
    }
  })
  readonly hasButton!: boolean

  @Prop({
    type: Boolean,
    default() {
      return false
    }
  })
  readonly hasLike!: boolean

  @Prop({
    type: Boolean,
    default() {
      return false
    }
  })
  readonly hasSubtitle!: boolean
}
</script>
<style lang="scss" scoped>
@import '../assets/scss/utils/variables';
@import '../assets/scss/utils/media';

.landingPageCard {
  display: block;
  cursor: pointer;
  border: 1px solid $greyNine;
  border-radius: 4px;
  min-height: 230px;
  @include grid-md {
    min-height: 280px;
  }
  &__img {
    height: 101px;
    background-position: center center;
    background-size: cover;
    @include grid-md {
      height: 151px;
    }
  }
  &__desc {
    padding: $spacing-xs;
    @include grid-md {
      padding: $spacing-s;
    }
  }
  &__notif {
    display: flex;
    align-items: center;
    font-size: $fz-xs;
    color: $orangeDark;
    margin-bottom: $spacing-s;
    @include grid-md {
      font-size: $fz-s - 1;
    }
  }
  &__notifIcon {
    width: 14px;
    height: 14px;
    background-image: url(/img/icon_fire.svg);
    background-position: center center;
    background-size: cover;
    margin-right: $spacing-xs;
  }
  &__title {
    display: block;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;

    font-size: $fz-xs;
    color: $greySeven;
    margin-bottom: $spacing-m;
    font-weight: bold;
    @include grid-md {
      font-size: $fz-s;
    }
  }
  &__subtitle {
    display: block;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;

    color: $greyTwo;
    font-size: $fz-xs;
    font-weight: bold;
    margin-bottom: $spacing-m;
    @include grid-md {
      font-size: $fz-s;
    }
  }
  &__info {
    display: flex;
    align-items: flex-end;
    @include grid-md {
      align-items: center;
    }
  }
  &__priceCross {
    color: $greyEight;
    font-size: $fz-xs;
    text-decoration: line-through;
    @include grid-md {
      font-size: $fz-s;
    }
  }
  &__price {
    display: flex;
    color: $orangeDark;
    font-weight: bold;
    > span {
      &:nth-child(odd) {
        font-size: $fz-xs;
      }
      &:nth-child(even) {
        font-size: $fz-xs;
      }
    }
    @include grid-lg {
      display: block;
      > span {
        &:nth-child(odd) {
          font-size: $fz-s - 1;
        }
        &:nth-child(even) {
          font-size: $fz-xl;
        }
      }
    }
  }
  &__btnbox {
    flex: 0 0 50%;
    display: flex;
    justify-content: flex-end;
    margin-left: auto;
    font-size: $fz-m;
    > button {
      font-size: $fz-xs;
      padding: $spacing-xs;
      @include grid-md {
        font-size: $fz-xs;
        padding: $spacing-m $spacing-s;
      }
      @include grid-lg {
        font-size: $fz-s;
      }
      @include grid-xl {
        font-size: $fz-s;
        padding: $spacing-m $spacing-l;
      }
    }
  }
  &__like {
    cursor: pointer;
    margin-left: auto;
    width: 22px;
    height: 22px;
    background-image: url(/img/btn_enabled_like.svg);
    background-position: center center;
    background-size: cover;
  }
  &__distance {
    color: $greyEight;
    font-size: $fz-s;
  }
}
</style>
