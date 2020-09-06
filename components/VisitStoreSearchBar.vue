<template>
  <div class="visitStoreSearchBar" :class="{ 'visitStoreSearchBar--sticky': isSticky }">
    <ul class="visitStoreSearchBar__list">
      <li
        class="visitStoreSearchBar__listitem"
        :class="{ 'visitStoreSearchBar__listitem--active': currentTab === 1 }"
        @mouseover="handleMouseover($event, 1)"
        @mouseleave="currentTab = 0"
      >
        <span>
          {{
          category.content.find((item) => item.value === values.categoryId)
          ? category.content.find((item) => item.value === values.categoryId)
          .text === '全部'
          ? '所有店家'
          : category.content.find(
          (item) => item.value === values.categoryId
          ).text
          : ''
          }}
        </span>
        <fa
          :icon="['fas', 'angle-down']"
          class="visitStoreSearchBar__caret"
          v-show="currentTab !== 1"
        ></fa>
        <fa
          :icon="['fas', 'angle-up']"
          class="visitStoreSearchBar__caret"
          v-show="currentTab === 1"
        ></fa>
        <ul
          class="visitStoreSearchBar__sublist visitStoreSearchBar__sublist--type"
          :class="{ 'visitStoreSearchBar__sublist--active': currentTab === 1 }"
        >
          <li
            class="visitStoreSearchBar__sublistitem sublist"
            :class="{
              'visitStoreSearchBar__sublistitem--active': currentTab === 1
            }"
          >
            <div
              class="selectIcon selectIcon--type sublist"
              :class="{
                'selectIcon--active': currentTab === 1,
                'selectIcon--selected': item.value === values.categoryId
              }"
              v-for="item in category.content"
              :key="item.value"
              @click="
                $emit('update-search', {
                  value: item.value,
                  params: category.params
                })
              "
            >
              <div
                :style="{
                  'background-image': `url(${
                    item.value === values.categoryId
                      ? item.hoverImageUrl
                      : item.normalImageUrl
                  })`
                }"
                class="sublist"
              ></div>
              <span class="sublist">{{ item.text }}</span>
            </div>
          </li>
        </ul>
      </li>
      <li
        class="visitStoreSearchBar__listitem"
        :class="{ 'visitStoreSearchBar__listitem--active': currentTab === 2 }"
        @mouseover="handleMouseover($event, 2)"
        @mouseleave="currentTab = 0"
      >
        <span>
          {{
          area.content.find((item) => item.value === values.areaId)
          ? area.content.find((item) => item.value === values.areaId).text ===
          '全部'
          ? '全部地區'
          : area.content.find((item) => item.value === values.areaId).text
          : ''
          }}
        </span>
        <fa
          :icon="['fas', 'angle-down']"
          class="visitStoreSearchBar__caret"
          v-show="currentTab !== 2"
        ></fa>
        <fa
          :icon="['fas', 'angle-up']"
          class="visitStoreSearchBar__caret"
          v-show="currentTab === 2"
        ></fa>
        <ul
          class="visitStoreSearchBar__sublist visitStoreSearchBar__sublist--area"
          :class="{ 'visitStoreSearchBar__sublist--active': currentTab === 2 }"
        >
          <li
            class="visitStoreSearchBar__sublistitem sublist"
            :class="{
              'visitStoreSearchBar__sublistitem--active': currentTab === 2
            }"
          >
            <div
              class="selectIcon selectIcon--area sublist"
              :class="{
                'selectIcon--active': currentTab === 2,
                'selectIcon--selected': item.value === values.areaId
              }"
              v-for="item in area.content"
              :key="item.value"
              @click="
                $emit('update-search', {
                  value: item.value,
                  params: area.params
                })
              "
            >
              <span class="sublist">{{ item.text }}</span>
            </div>
          </li>
        </ul>
      </li>
      <li
        class="visitStoreSearchBar__listitem"
        :class="{ 'visitStoreSearchBar__listitem--active': currentTab === 3 }"
        @mouseover="handleMouseover($event, 3)"
        @mouseleave="currentTab = 0"
        v-if="type !== 'shoppingmall'"
      >
        <span>
          {{
          groupType.content.find((item) => item.value === values.groupType)
          ? groupType.content.find((item) => item.value === values.groupType)
          .text
          : ''
          }}
        </span>
        <fa
          :icon="['fas', 'angle-down']"
          class="visitStoreSearchBar__caret"
          v-show="currentTab !== 3"
        ></fa>
        <fa
          :icon="['fas', 'angle-up']"
          class="visitStoreSearchBar__caret"
          v-show="currentTab === 3"
        ></fa>
        <ul
          class="visitStoreSearchBar__sublist visitStoreSearchBar__sublist--store"
          :class="{ 'visitStoreSearchBar__sublist--active': currentTab === 3 }"
        >
          <li
            class="visitStoreSearchBar__sublistitem sublist"
            :class="{
              'visitStoreSearchBar__sublistitem--active': currentTab === 3
            }"
          >
            <div
              class="selectIcon selectIcon--store sublist"
              :class="{
                'selectIcon--active': currentTab === 3,
                'selectIcon--selected': item.value === values.groupType
              }"
              v-for="item in groupType.content"
              :key="item.value"
              @click="
                $emit('update-search', {
                  value: item.value,
                  params: groupType.params
                })
              "
            >
              <span class="sublist">{{ item.text }}</span>
            </div>
          </li>
        </ul>
      </li>
      <li
        class="visitStoreSearchBar__listitem"
        :class="{ 'visitStoreSearchBar__listitem--active': currentTab === 4 }"
        @mouseover="handleMouseover($event, 4)"
        @mouseleave="currentTab = 0"
      >
        <span>
          {{
          sort.content.find((item) => item.value === values.sort)
          ? sort.content.find((item) => item.value === values.sort).text
          : ''
          }}
        </span>
        <fa
          :icon="['fas', 'angle-down']"
          class="visitStoreSearchBar__caret"
          v-show="currentTab !== 4"
        ></fa>
        <fa
          :icon="['fas', 'angle-up']"
          class="visitStoreSearchBar__caret"
          v-show="currentTab === 4"
        ></fa>
        <ul
          class="visitStoreSearchBar__sublist visitStoreSearchBar__sublist--closest"
          :class="{ 'visitStoreSearchBar__sublist--active': currentTab === 4 }"
        >
          <li
            class="visitStoreSearchBar__sublistitem sublist"
            :class="{
              'visitStoreSearchBar__sublistitem--active': currentTab === 4
            }"
          >
            <div
              class="selectIcon selectIcon--closest sublist"
              :class="{
                'selectIcon--active': currentTab === 4,
                'selectIcon--selected': item.value === values.sort
              }"
              v-for="item in sort.content"
              :key="item.value"
              @click="
                $emit('update-search', {
                  value: item.value,
                  params: sort.params
                })
              "
            >
              <span class="sublist">{{ item.text }}</span>
            </div>
          </li>
        </ul>
      </li>
    </ul>
    <div class="visitStoreSearchBar__search">
      <default-search-bar
        placeholder="輸入特約商家名稱"
        @blur="$emit('update-search', { value: $event, params: 'keyWord' })"
        @keydown-enter="
          $emit('update-search', { value: $event, params: 'keyWord' })
        "
      />
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'nuxt-property-decorator'
import DefaultSearchBar from '~/components/DefaultSearchBar.vue'

@Component({
  components: {
    DefaultSearchBar
  }
})
export default class VisitStoreSearchBar extends Vue {
  @Prop({
    type: Object,
    default() {
      return {}
    }
  })
  readonly values!: any

  @Prop({
    type: Array,
    default() {
      return []
    }
  })
  readonly categories!: any

  @Prop({
    type: Array,
    default() {
      return []
    }
  })
  readonly areas!: any

  @Prop({
    type: String,
    default() {
      return ''
    }
  })
  readonly type!: string

  public currentTab: Number = 0
  handleMouseover(e: any, val: Number): void {
    if (!e.target.classList.contains('sublist')) this.currentTab = val
  }

  public isSticky: boolean = false

  public category: any = {
    params: 'categoryId',
    content: [
      {
        text: '全部',
        value: 0,
        hoverImageUrl:
          'https://hnstayfuntst.blob.core.windows.net/store/white/icon-all.png',
        normalImageUrl:
          'https://hnstayfuntst.blob.core.windows.net/store/color/icon-all.png'
      },
      {
        text: '美食',
        value: '47f0d4e4-3c1c-489d-99db-3ca9eeef6f5a',
        hoverImageUrl:
          'https://hnstayfuntst.blob.core.windows.net/store/white/icon-food.png',
        normalImageUrl:
          'https://hnstayfuntst.blob.core.windows.net/store/color/icon-food.png'
      },
      {
        text: '住宿',
        value: '70f56c1e-0648-45de-b318-82ce653ea49c',
        hoverImageUrl:
          'https://hnstayfuntst.blob.core.windows.net/store/white/icon-hotel.png',
        normalImageUrl:
          'https://hnstayfuntst.blob.core.windows.net/store/color/icon-hotel.png'
      },
      {
        text: '舒壓',
        value: '2d75d35b-46c6-41c1-8711-33a52ddbb8fc',
        hoverImageUrl:
          'https://hnstayfuntst.blob.core.windows.net/store/white/icon-spa.png',
        normalImageUrl:
          'https://hnstayfuntst.blob.core.windows.net/store/color/icon-spa.png'
      },
      {
        text: '生活',
        value: '4546f771-ec3a-44c4-b788-e5440c744857',
        hoverImageUrl:
          'https://hnstayfuntst.blob.core.windows.net/store/white/icon-live.png',
        normalImageUrl:
          'https://hnstayfuntst.blob.core.windows.net/store/color/icon-live.png'
      },
      {
        text: '時尚',
        value: 'e4fcd11d-abb2-4e54-b448-67c69931fc1d',
        hoverImageUrl:
          'https://hnstayfuntst.blob.core.windows.net/store/white/icon-fasion.png',
        normalImageUrl:
          'https://hnstayfuntst.blob.core.windows.net/store/color/icon-fasion.png'
      }
    ]
  }

  public area: any = {
    params: 'areaId',
    content: [
      { text: '全部', value: 0 },
      { text: '台北', value: 1 },
      { text: '新北', value: 2 },
      { text: '桃園', value: 3 },
      { text: '新竹', value: 4 },
      { text: '苗栗', value: 5 },
      { text: '台中', value: 6 },
      { text: '彰化', value: 7 },
      { text: '南投', value: 8 },
      { text: '雲林', value: 9 },
      { text: '嘉義', value: 10 },
      { text: '台南', value: 11 },
      { text: '高雄', value: 12 },
      { text: '屏東', value: 13 },
      { text: '基隆', value: 14 },
      { text: '宜蘭', value: 15 },
      { text: '花蓮', value: 16 },
      { text: '台東', value: 17 },
      { text: '澎湖', value: 18 },
      { text: '金門', value: 19 },
      { text: '馬祖', value: 20 }
    ]
  }

  public groupType: any = {
    params: 'groupType',
    content: [
      { text: '所有店家', value: 0 },
      { text: '公司專屬特約', value: 1 },
      { text: 'STAYFUN 特約', value: 2 }
    ]
  }

  public sort: any = {
    params: 'sort',
    content: [
      { text: '離我最近', value: 1 },
      { text: '最新上架', value: 6 },
      { text: '人氣最高', value: 3 },
      { text: '評價最高', value: 2 },
      { text: '消費由低到高', value: 4 },
      { text: '消費由高到低', value: 5 }
    ]
  }

  public handleScroll() {
    const target: any = document.querySelector('.visitStoreSearchBar')
    if (target !== null) {
      const position = target.getBoundingClientRect().top + window.scrollY
      if (window.pageYOffset > position) this.isSticky = true
      else this.isSticky = false
    }
  }

  public mounted() {
    window.addEventListener('scroll', this.handleScroll)
  }

  public beforeDestroyed() {
    window.removeEventListener('scroll', this.handleScroll)
  }
}
</script>
<style lang="scss" scoped>
@import '../assets/scss/utils/variables';
@import '../assets/scss/utils/media';

.visitStoreSearchBar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  border-bottom: 1px solid $greyOne;
  &--sticky {
    position: sticky;
    top: 0;
    left: 0;
    z-index: 10;
  }
  &__list {
    flex: 0 0 100%;
    display: flex;
    @include grid-md {
      > li {
        padding-left: $spacing-xxl;
      }
    }
    @include grid-lg {
      flex: 0 0 auto;
    }
    > li:not(:last-child) {
      &:after {
        content: '';
        display: inline-block;
        position: absolute;
        right: 0;
        height: 25px;
        width: 1px;
        background-color: $greyOne;
      }
    }
  }
  &__listitem {
    font-weight: bold;
    position: relative;
    padding: $spacing-xxl $spacing-s;
    text-align: center;
    cursor: pointer;
    &--active {
      z-index: 10;
    }
    @include grid-md {
      text-align: left;
    }
    > span {
      font-size: 1rem;
      color: $black;
    }
  }
  &__caret {
    color: $primary;
    font-size: $fz-m;
    width: 100%;
    margin: 0 auto;
    @include grid-md {
      width: auto;
      margin-left: $spacing-l;
      margin-right: $spacing-xs;
    }
  }
  &__sublist {
    position: absolute;
    top: 100%;
    left: 0;
    width: auto;
    border: none;
    height: 0%;
    font-size: 0;
    padding: 0;
    transition: height 0.3s ease-out;
    background-color: #fff;
    &--active {
      z-index: 10;
      font-size: inherit;
      height: auto;
      padding: $spacing-xxl $spacing-xl $spacing-s $spacing-xl;
      max-height: 200px;
      overflow: auto;
      @include grid-lg {
        max-height: initial;
      }
    }
    &--type {
      @include grid-md {
        width: 289px;
      }
    }
    &--area {
      @include grid-md {
        width: 388px;
      }
    }
    &--store {
      @include grid-md {
        width: 200px;
      }
    }
    &--closest {
      @include grid-md {
        width: 271px;
      }
    }
  }
  &__sublistitem {
    display: flex;
    flex-wrap: wrap;
    position: relative;
    z-index: -1000;
    &--active {
      z-index: 3;
    }
  }
  &__search {
    width: 100%;
    margin: $spacing-l auto;
    padding: 0 $spacing-l;
    @include grid-lg {
      margin-left: auto;
      margin-right: $spacing-xxl;
      width: 30%;
      margin-top: 0;
      margin-bottom: 0;
    }
    @include grid-xl {
      width: 20%;
    }
  }
}
::-webkit-input-placeholder {
  /* Edge */
  color: $whiteOne;
  font-size: 1rem;
  font-weight: bold;
}

:-ms-input-placeholder {
  /* Internet Explorer */
  color: $whiteOne;
  font-size: 1rem;
  font-weight: bold;
}

::placeholder {
  color: $whiteOne;
  font-size: 1rem;
  font-weight: bold;
}

.selectIcon {
  flex: 0 0 98%;
  margin-left: 1%;
  margin-right: 1%;
  padding: $spacing-s $spacing-xs;
  visibility: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  border-radius: 4px;
  font-size: $fz-xs;
  margin-bottom: $spacing-l;
  border: 1px solid $whiteOne;
  > span {
    color: $greyTwo;
  }

  &:hover {
    background-color: $orangeLight;
  }
  > div {
    background-repeat: no-repeat;
    background-position: center center;
    height: 63px;
    width: 63px;
  }
  &--type {
    @include grid-md {
      padding: $spacing-xs $spacing-xs;
      flex: 0 0 30%;
      margin-left: 1.555555555555%;
      margin-right: 1.555555555555%;
    }
  }
  &--area {
    @include grid-md {
      padding: $spacing-s $spacing-l;
      flex: 0 0 23%;
      margin-left: 1%;
      margin-right: 1%;
      font-size: $fz-s;
    }
  }
  &--store {
    @include grid-md {
      padding: $spacing-m $spacing-xxl;
      font-size: $fz-s;
    }
  }
  &--closest {
    @include grid-md {
      padding: $spacing-m $spacing-xxl;
      flex: 0 0 46%;
      margin-left: 2%;
      margin-right: 2%;
      font-size: $fz-s;
    }
  }
  &--active {
    visibility: visible;
  }
  &--selected {
    background-color: $primary;
    &:hover {
      background-color: $primary;
    }
    > span {
      color: #fff;
    }
  }
}
</style>
