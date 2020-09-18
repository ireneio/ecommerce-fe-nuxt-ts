<template>
  <div>
    <div class="landingFooter__top"></div>
    <b-container>
      <b-row>
        <b-col cols="24">
          <footer class="landingFooter">
            <div class="landingFooter__logoBox">
              <img
                src="/img/stayfun_logo.svg"
                alt="stayfun logo"
                class="landingFooter__logo"
              />
            </div>
            <ul class="landingFooter__list">
              <li>
                <nuxt-link to="/qa">常見問題</nuxt-link>
              </li>
              <li>
                <nuxt-link to="/policies">會員服務條款</nuxt-link>
              </li>
              <li>
                <nuxt-link to="/privacy">隱私權政策</nuxt-link>
              </li>
            </ul>
            <ul class="landingFooter__list">
              <li>
                <a
                  href="https://docs.google.com/forms/d/e/1FAIpQLSfcIYRzm9KHdKOCOkWQMRXjzMX3131n9Q96Qye2MTcgayuRLw/viewform"
                  target="_blank"
                >
                  特約商家推薦
                </a>
              </li>
              <li>
                <nuxt-link to="/contact">聯絡我們</nuxt-link>
              </li>
            </ul>
            <ul class="landingFooter__downloadlist">
              <li>
                <a
                  href="https://apps.apple.com/tw/app/stayfun-%E5%93%A1%E5%B7%A5%E7%A6%8F%E5%88%A9%E6%95%B4%E5%90%88%E5%B9%B3%E5%8F%B0/id1182909836"
                  target="_blank"
                >
                  <img
                    src="/img/downloadapple.svg"
                    alt="appstore download logo"
                    class="landingFooter__downloadicon"
                  />
                </a>
              </li>
              <li>
                <a
                  href="https://play.google.com/store/apps/details?id=com.huanuage.stayfun&hl=zh_TW"
                  target="_blank"
                >
                  <img
                    src="/img/downloadgoogle.svg"
                    alt="google playstore download logo"
                    class="landingFooter__downloadicon"
                  />
                </a>
              </li>
            </ul>
            <div class="landingFooter__socialmedia">
              <div>
                <a
                  href="https://www.facebook.com/stayfungogogo/"
                  target="_blank"
                >
                  <img
                    src="/img/icon_facebook.svg"
                    alt="facebook logo"
                    class="landingFooter__icon"
                  />
                </a>
                <a href="mailto:stayfun_service@mayohr.com">
                  <img
                    src="/img/icon_mail.svg"
                    alt="mail logo"
                    class="landingFooter__icon"
                  />
                </a>
              </div>
              <p>Copyright © STAYFUN Inc. All Right Reserved.</p>
            </div>
          </footer>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class LandingFooter extends Vue {}
</script>
<style lang="scss" scoped>
@import '../assets/scss/utils/variables';
@import '../assets/scss/utils/media';

.landingFooter {
  display: flex;
  flex-wrap: wrap;
  padding-top: 65px;
  padding-bottom: 50px;
  background-color: #fff;
  &__top {
    height: 8px;
    background-color: $primary;
  }
  &__logo {
    height: 47px;
    width: 67px;
  }
  &__logoBox {
    flex: 0 0 50%;
    order: 0;
    width: 15%;
    @include grid-md {
      flex: 0 0 15%;
    }
    @include grid-lg {
      flex: 0 0 auto;
    }
  }
  &__icon {
    height: 40px;
    width: 40px;
  }
  &__list {
    flex: 0 0 50%;
    order: 3;
    margin-top: $spacing-s;
    margin-bottom: $spacing-s;
    @include grid-md {
      flex: 0 0 calc(85% / 3);
      margin-top: 0;
      margin-bottom: 0;
      order: 2;
    }
    width: 15%;
    @include grid-lg {
      flex: 0 0 auto;
      display: block;
    }
    li {
      @include grid-md {
        display: flex;
        align-items: center;
        justify-content: center;
      }
      @include grid-lg {
        display: block;
      }
      padding-bottom: 12px;
      a {
        font-size: $fz-s;
        color: $greyTwo;
      }
    }
  }
  &__downloadlist {
    flex: 0 0 50%;
    order: 2;
    width: 15%;
    @include grid-md {
      order: 3;
      flex: 0 0 calc(85% / 3);
    }
    @include grid-lg {
      flex: 0 0 auto;
    }
    li:last-child {
      padding: $spacing-s 0;
    }
  }
  &__downloadicon {
    height: 40px;
    width: 120px;
  }
  &__socialmedia {
    flex: 0 0 100%;
    order: 4;
    width: 40%;
    @include grid-lg {
      flex: 0 0 auto;
    }
    a {
      &:last-child {
        margin-left: $spacing-l;
      }
    }
    p {
      margin-top: 30px;
      font-size: $fz-s;
      color: $greyTwo;
    }
  }
}
</style>
