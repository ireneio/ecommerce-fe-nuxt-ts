<template>
  <div class="landingPageAppCarousel">
    <client-only>
      <vue-slick-carousel v-bind="carouselSetting">
        <div v-for="(item, index) in icons" :key="index">
          <landing-page-app-icon
            :text="item.text"
            :url="item.url"
            :icon="item.icon"
            @click="$emit('click', item)"
          />
        </div>
        <div v-for="i in 5" :key="i" v-show="!icons.length"></div>
      </vue-slick-carousel>
    </client-only>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import VueSlickCarousel from 'vue-slick-carousel'
import LandingPageAppIcon from '~/components/LandingPageAppIcon.vue'

import 'vue-slick-carousel/dist/vue-slick-carousel.css'
import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css'

interface Icon {
  text: string
  url: string
  icon: string
  isDisplayHintMessage: boolean
  redirectHintMessage: string
}

@Component({
  components: {
    VueSlickCarousel,
    LandingPageAppIcon
  }
})
export default class LandingPageAppCarousel extends Vue {
  @Prop({
    type: Array,
    default() {
      return []
    }
  })
  readonly icons!: Array<Icon>

  carouselSetting: any = {
    dots: false,
    edgeFriction: 0.35,
    infinite: false,
    speed: 500,
    slidesToShow: 10,
    slidesToScroll: 7,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 10,
          slidesToScroll: 5
        }
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 9,
          slidesToScroll: 9
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 5
        }
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4
        }
      },
      {
        breakpoint: 350,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3
        }
      }
    ]
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/utils/variables';
@import '../assets/scss/utils/media';

.landingPageAppCarousel {
  padding: 16px 0 16px 0;
  @include grid-md {
    padding: 32px 0 40px 0;
  }
  @include grid-xl {
    padding: 32px 64px 40px 64px;
  }
  background-color: #fff;
}
</style>
