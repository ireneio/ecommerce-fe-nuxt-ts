<template>
  <b-container class="mb-5">
    <b-row>
      <b-col cols="24">
        <div class="welfare__title">津貼中心</div>
      </b-col>
    </b-row>
    <b-row>
      <client-only>
        <b-col cols="24" xl="4">
          <div class="welfaremenu">
            <h3 class="welfaremenu__title">
              <img src="/img/ic-welfare.svg" alt />
              <span>津貼中心</span>
            </h3>
            <ul class="welfaremenu__list">
              <li class="welfaremenu__listitem" v-if="isAuthorized">
                <nuxt-link
                  to="/welfare/authorize"
                  class="welfaremenu__link"
                  :class="{
                    'welfaremenu__link--active':
                      $route.name === 'welfare-authorize'
                  }"
                  >我的簽核
                </nuxt-link>
              </li>
              <li class="welfaremenu__listitem">
                <nuxt-link
                  to="/welfare/reportlist"
                  class="welfaremenu__link"
                  :class="{
                    'welfaremenu__link--active':
                      $route.name === 'welfare-reportlist'
                  }"
                  >申請紀錄
                </nuxt-link>
              </li>
              <li>
                <nuxt-link
                  to="/welfare"
                  class="welfaremenu__link"
                  :class="{
                    'welfaremenu__link--active': $route.name === 'welfare'
                  }"
                  >表單申請
                </nuxt-link>
              </li>
            </ul>
          </div>
        </b-col>
      </client-only>
      <b-col cols="24" xl="20" class="mt-5 mt-xl-0">
        <header
          class="welfareheader"
          :class="{
            'welfareheader--dark': title === '申請紀錄' || title === '我的簽核',
            'welfareheader--light': title === '表單申請'
          }"
          v-if="title"
        >
          <h3 class="welfareheader__title">{{ title }}</h3>
          <div class="welfareheader__search" v-if="title === '我的簽核'">
            <default-search-bar
              placeholder="輸入關鍵字"
              @input="$emit('input', $event)"
              @keydown-enter="$emit('keydown-enter', $event)"
              @click="$emit('click', $event)"
            />
          </div>
        </header>
        <div v-if="!title">
          <slot name="header"></slot>
        </div>
        <main
          class="welfaremain"
          :class="{
            'welfaremain--light': title === '申請紀錄' || title === '審核紀錄',
            'welfaremain--dark': title === '表單申請',
            'welfaremain--isolatedsection': title
          }"
        >
          <slot></slot>
        </main>
      </b-col>
    </b-row>
  </b-container>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import DefaultSearchBar from '~/components/DefaultSearchBar.vue'

@Component
export default class WelfareContainer extends Vue {
  @Prop({
    type: String,
    default() {
      return ''
    }
  })
  readonly title!: string

  @Prop({
    type: Boolean,
    default() {
      return false
    }
  })
  readonly isAuthorized!: boolean
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/utils/variables';

.welfare {
  &__title {
    font-size: $fz-xxl;
    font-weight: bold;
    padding: $spacing-xxl 0;
  }
}
.welfaremain,
.welfaremenu,
.welfareheader {
  padding: $spacing-xl;
  border-radius: 4px;
  border: 1px solid $whiteOne;
}
.welfareheader {
  display: flex;
  align-items: center;
  padding: $spacing-l;
  border-bottom: none;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  &--dark {
    background-color: $whiteTwo;
  }
  &--light {
    background-color: #fff;
  }
  &__title {
    height: 40px;
    line-height: 40px;
    font-size: $fz-xl;
    font-weight: bold;
  }
  &__search {
    margin-left: auto;
    width: 30%;
  }
}
.welfaremain {
  margin-top: $spacing-xl;
  &--isolatedsection {
    margin-top: 0;
    border-top: none;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
  &--dark {
    background-color: $whiteTwo;
  }
  &--light {
    background-color: #fff;
  }
}
.welfaremenu {
  &__title {
    display: flex;
    align-items: center;
    font-size: $fz-m;
    font-weight: bold;
    letter-spacing: 6px;
    border-radius: 40px;
    background-color: $whiteTwo;
    padding: $spacing-xs $spacing-s;
    > span {
      margin-left: $spacing-xs;
    }
  }
  &__list {
    line-height: 2;
    margin-top: $spacing-s;
    padding-left: $spacing-s;
  }
  &__link {
    display: inline-block;
    width: 100%;
    color: $greyThree;
    &:hover {
      color: $orangeDark;
    }
    &--active {
      color: $primary;
    }
  }
}
</style>
