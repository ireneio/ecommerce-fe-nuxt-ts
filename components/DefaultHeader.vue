<template>
  <div>
    <div class="logoBar__bg">
      <b-container>
        <b-row>
          <b-col cols="24">
            <div class="logoBar">
              <div class="logoBar__logo">
                <img src="/img/sf-logo.png" alt="" />
              </div>
              <div class="logoBar__user">
                <span>Welcome:</span>
                <span>{{ user }}</span>
              </div>
              <div class="logoBar__signout" @click="$emit('logout')">
                <a href="javascript:;">登出</a>
              </div>
            </div>
          </b-col>
        </b-row>
      </b-container>
    </div>
    <b-container>
      <b-row>
        <b-col cols="24">
          <nav class="navigationbar">
            <div
              class="navigationbar__logo"
              @click="$router.push({ name: 'index' })"
            ></div>
            <ul class="navigationbar__navigation">
              <li
                class="navigationbar__navlink"
                @click="$router.push({ name: 'index' })"
              >
                <a href="javascript:;">首頁</a>
              </li>
              <li
                class="navigationbar__navlink"
                @click="$router.push({ name: 'announcements' })"
                v-if="menu.includes('訊息牆')"
              >
                <a href="javascript:;">訊息牆</a>
              </li>
              <li
                class="navigationbar__navlink"
                @click="$router.push({ name: 'funevents' })"
                v-if="menu.includes('瘋活動')"
              >
                <a href="javascript:;">瘋活動</a>
              </li>
              <li
                class="navigationbar__navlink"
                @click="$router.push({ name: 'joinclub' })"
                v-if="menu.includes('揪團樂')"
              >
                <a href="javascript:;">揪團樂</a>
              </li>
              <li
                class="navigationbar__navlink"
                @click="$router.push({ name: 'visitstore' })"
                v-if="menu.includes('逛特約')"
              >
                <a href="javascript:;">逛特約</a>
              </li>
              <li
                class="navigationbar__navlink"
                @click="$router.push({ name: 'questionnaires' })"
                v-if="menu.includes('調查所')"
              >
                <a href="javascript:;">調查所</a>
              </li>
              <li
                class="navigationbar__navlink"
                @click="$router.push({ name: 'welfare' })"
                v-if="menu.includes('津貼中心')"
              >
                <a href="javascript:;">津貼中心</a>
              </li>
              <li
                class="navigationbar__navlink"
                @click="$router.push({ name: 'member-info' })"
                v-if="menu.includes('我的專區')"
              >
                <a href="javascript:;">我的專區</a>
              </li>
            </ul>
          </nav>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'

@Component
export default class DefaultHeader extends Vue {
  @Prop({
    type: Array,
    default() {
      return []
    }
  })
  readonly menu!: Array<any>

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

.logoBar {
  display: flex;
  align-items: center;
  @include grid-md {
    height: 35px;
  }
  &__bg {
    width: 100%;
    background-color: $whiteThree;
  }
  &__user {
    display: none;
    @include grid-md {
      display: block;
    }
    margin-left: auto;
    color: $greyThree;
    font-weight: bold;
    span {
      &:last-child {
        cursor: pointer;
        &:hover {
          color: $primary;
        }
      }
    }
  }
  &__signout {
    padding: 15px;
    margin-left: auto;
    @include grid-md {
      margin-left: 30px;
    }
    @include grid-xxl {
      position: relative;
      right: -30px;
      margin-left: 0;
    }
    a {
      color: $greyThree;
      font-weight: bold;
      &:hover {
        color: $primary;
      }
    }
  }
}
.navigationbar {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  width: 100%;
  @include grid-xl {
    height: 120px;
  }
  &__logo {
    flex: 0 0 100%;
    max-height: 88px;
    @include grid-xl {
      flex: 0 0 auto;
      max-height: auto;
    }
    cursor: pointer;
    width: 200px;
    height: 200px;
    background: url(https://hnstayfuntst.blob.core.windows.net/profile/5f1a019f-ddc6-4c6e-b86d-05696a80d366.png);
    background-position: bottom center;
    background-repeat: no-repeat;
    background-size: contain;
  }
  &__navigation {
    flex: 0 0 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin-left: auto;
    @include grid-xl {
      flex: 0 0 auto;
      justify-content: flex-start;
    }
  }
  &__navlink {
    padding: 10px 25px;
    cursor: pointer;
    &:hover {
      a {
        color: $primary;
      }
    }
    a {
      display: block;
      width: 100%;
      font-size: $fz-l;
      color: $greyThree;
      font-weight: bold;
      &--active {
        color: $primary;
      }
    }
  }
}
</style>
