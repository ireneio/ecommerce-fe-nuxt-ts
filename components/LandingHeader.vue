<template>
  <div>
    <b-container style="max-width: 1600px;">
      <b-row>
        <b-col cols="24" class="pr-0 pr-md-4">
          <header class="landingHeader">
            <h1
              class="landingHeader__logo"
              :style="{ 'background-image': `url(${logoUrl})` }"
            ></h1>
            <!-- <div class="landingHeader__leftnavWrapper">
              <b-container>
                <b-row>
                  <b-col>
                    <div class="landingHeader__leftnav">
                      <nuxt-link to="/joinclub">
                        揪團樂
                      </nuxt-link>
                      <nuxt-link to="/funevents">
                        瘋活動
                      </nuxt-link>
                      <nuxt-link to="/visitstore">
                        逛特約
                      </nuxt-link>
                    </div>
                  </b-col>
                </b-row>
              </b-container>
            </div> -->
            <nav class="landingHeader__nav">
              <div class="landingHeader__rightnav">
                <nuxt-link to="/member/info" class="landingHeader__user">
                  <fa
                    :icon="['fas', 'user-circle']"
                    class="landingHeader__icon"
                  />
                  <span>{{ user }}</span>
                </nuxt-link>
                <nuxt-link to="/announcements" class="landingHeader__bell">
                  <fa :icon="['far', 'bell']" class="landingHeader__icon" />
                </nuxt-link>
              </div>
            </nav>
          </header>
        </b-col>
      </b-row>
    </b-container>
    <div class="landingHeader__bottom"></div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'

@Component
export default class LandingHeader extends Vue {
  @Prop({
    type: String,
    default() {
      return []
    }
  })
  readonly logoUrl!: string

  @Prop({
    type: String,
    default() {
      return []
    }
  })
  readonly user!: string
}
</script>
<style lang="scss" scoped>
@import '../assets/scss/utils/variables';
@import '../assets/scss/utils/media';

.landingHeader {
  display: flex;
  align-items: center;
  height: 82px;
  background-color: #fff;
  box-shadow: 0px 5px 7px -7px rgba($color: #000000, $alpha: 0.5);
  &__bottom {
    width: 100%;
    height: 8px;
    // background-color: $primary;
    // box-shadow: 0px 5px 7px -7px rgba($color: #000000, $alpha: 0.5);
  }
  &__logo {
    width: 180px;
    height: 58px;
    font-size: 1.25rem;
    line-height: 58px;
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center center;
  }
  &__nav {
    display: flex;
    align-items: center;
    width: 100%;
  }
  &__leftnav {
    display: none;
    @include grid-lg {
      display: block;
    }
    a {
      color: $greyTwo;
      margin: 0 $spacing-s;
      padding: 32px 16px;
      &:hover {
        color: $orangeDark;
      }
    }
  }
  &__leftnavWrapper {
    width: 100vw;
  }
  &__rightnav {
    margin-left: auto;
    display: flex;
    align-items: center;
    span {
      margin: 0 $spacing-s;
      color: $greyTwo;
      padding: 16px;
    }
    a {
      color: $greyTwo;
      margin: 0 $spacing-xs;
      padding: $spacing-l $spacing-s;
      @include grid-md {
        padding: $spacing-l;
      }
    }
    select {
      margin-right: $spacing-s;
    }
  }
  &__icon {
    font-size: $fz-xl;
    &:hover {
      color: $orangeDark;
    }
  }
  &__bell {
    margin-top: $spacing-xl;
  }
  &__user {
    cursor: pointer;
    display: flex;
    align-items: center;
    &:hover {
      color: $orangeDark;
      > span:last-child {
        color: $orangeDark;
      }
    }
    > span:last-child {
      display: none;
      @include grid-md {
        display: block;
        margin-bottom: 2px;
        padding-right: 0;
        margin-left: -4px;
        &:hover {
          color: $orangeDark;
        }
      }
    }
  }
}
</style>
