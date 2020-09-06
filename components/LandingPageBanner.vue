<template>
  <div class="landingPageBanner">
    <client-only>
      <vue-slick-carousel v-bind="carouselSetting">
        <div class="landingPageBanner__item" v-for="i in 15" :key="i" v-show="!items.length"></div>
        <a
          :href="item.url"
          class="landingPageBanner__item"
          v-for="item in items"
          :key="item.serialno"
          :style="{ 'background-image': `url(${item.image})` }"
        ></a>
        <template #prevArrow>
          <div class="landingPageBanner__arrowLeft"></div>
        </template>
        <template #nextArrow>
          <div class="landingPageBanner__arrowRight"></div>
        </template>
        <template #customPaging="page">
          <div class="landingPageBanner__dot" :class="{ 'landingPageBanner__dot--active': page }"></div>
        </template>
      </vue-slick-carousel>
    </client-only>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import VueSlickCarousel from 'vue-slick-carousel'

import 'vue-slick-carousel/dist/vue-slick-carousel.css'
import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css'

@Component({
  components: {
    VueSlickCarousel
  }
})
export default class LandingpageBanner extends Vue {
  @Prop({
    type: Array,
    default() {
      return []
    }
  })
  readonly items!: any

  carouselSetting: any = {
    dots: false,
    edgeFriction: 0.35,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    dotsClass: 'slick-dots',
    autoplay: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: false
        }
      }
    ]
  }
}
</script>
<style lang="scss" scoped>
@import '../assets/scss/utils/variables';
@import '../assets/scss/utils/media';

.landingPageBanner {
  max-width: 100%;
  &__item {
    display: block;
    height: 150px;
    background-image: url(/img/image.png);
    background-position: center center;
    background-size: contain;
    background-repeat: no-repeat;
    @include grid-md {
      height: 250px;
    }
    @include grid-lg {
      height: 405px;
    }
  }
  &__arrowLeft {
    left: 0;
    background: url(/img/icon_lwft.svg);
    &:hover {
      background: url(/img/icon_lwft.svg);
    }
    &:before {
      content: '';
    }
  }
  &__arrowRight {
    right: 0;
    background: url(/img/icon_right.svg);
    &:hover {
      background: url(/img/icon_right.svg);
    }
    &:before {
      content: '';
    }
  }
  &__arrowLeft,
  &__arrowRight {
    z-index: 10;
    width: 24px;
    height: 36px;
    background-position: center center;
    background-repeat: no-repeat;
    background-size: cover;
  }
  &__dot {
    height: 5px;
    width: 5px;
    margin-top: 15px;
    border-radius: 50%;
    background-color: $greyTwo;
  }
}

// .slick-dots {
//   bottom: -10px;
//   li {
//     width: 5px;
//     height: 5px;
//   }
// }
</style>
