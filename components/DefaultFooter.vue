<template>
  <div class="footerBar__bg">
    <b-container>
      <b-row>
        <b-col cols="24">
          <div class="footerBar">
            <nav class="footerBar__list">
              <div class="footerBar__listitem footerBar__navlinks">
                <nuxt-link to="/qa">常見問題</nuxt-link>
              </div>
              <div class="footerBar__listitem footerBar__navlinks">
                <nuxt-link to="/policies">會員服務條款</nuxt-link>
              </div>
              <div class="footerBar__listitem footerBar__navlinks">
                <nuxt-link to="/privacy">隱私權政策</nuxt-link>
              </div>
              <div class="footerBar__listitem footerBar__navlinks">
                <nuxt-link to="/contact">聯絡我們</nuxt-link>
              </div>
              <div class="footerBar__listitem footerBar__navlinks">
                <a href="javascript:;">特約商家推薦 </a>
              </div>
              <div class="footerBar__listitem footerBar__copyright">
                <span>
                  Copyright © MAYO Human Capital Inc. All Rights Reserved
                </span>
              </div>
            </nav>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class DefaultFooter extends Vue {}
</script>
<style lang="scss" scoped>
@import '../assets/scss/utils/variables';
@import '../assets/scss/utils/media';

.footerBar {
  width: 100%;
  padding: 0 8%;
  &__bg {
    position: relative;
    z-index: 2;
    width: 100%;
    background-color: $whiteThree;
  }
  &__list {
    display: flex;
    flex-wrap: wrap;
  }
  &__listitem {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  &__navlinks {
    flex: 0 0 50%;
    padding: $spacing-s $spacing-s;
    font-weight: bold;
    font-size: $fz-s;
    > a {
      color: $greyThree;
      &:hover {
        color: $primary;
      }
    }
    @include grid-md {
      flex: 0 0 calc(100% / 5);
      padding: $spacing-l $spacing-s;
    }
    @include grid-xl {
      flex: 0 0 calc(55% / 5);
    }
  }
  &__copyright {
    flex: 0 0 100%;
    text-align: center;
    display: block;
    width: 100%;
    padding: $spacing-l 0;
    font-size: $fz-s;
    color: $greyThree;
    @include grid-xl {
      flex: 0 0 45%;
    }
  }
}
</style>
