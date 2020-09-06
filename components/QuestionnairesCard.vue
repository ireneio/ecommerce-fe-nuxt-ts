<template>
  <div class="questionnairesCard" @click="$emit('click')">
    <span
      class="questionnairesCard__circle"
      :class="{
        'questionnairesCard__circle--primary': value.status === 2,
        'questionnairesCard__circle--white': isExpired
      }"
    ></span>
    <div class="questionnairesCard__description">
      <h5
        class="questionnairesCard__text"
        :class="{
          'questionnairesCard__text--primary': value.status === 0,
          'questionnairesCard__text--white': isExpired,
          'questionnairesCard__text--grey':
            value.status === 0 && type === 'announcements'
        }"
      >
        {{ value.title }}
      </h5>
      <span
        class="questionnairesCard__pic"
        v-if="hasPic"
        :style="{
          'background-image':
            type === 'announcements' && value.isPeriod
              ? 'url(/img/survey.png)'
              : ''
        }"
      >
        <fa
          :icon="['fa', 'thumbtack']"
          class="questionnairesCard__icon"
          v-if="type === 'announcements' && value.isPinned"
        ></fa>
        <fa
          :icon="['fas', 'paperclip']"
          class="questionnairesCard__icon"
          v-if="type === 'announcements' && value.isFiles"
        ></fa>
      </span>
      <span
        class="questionnairesCard__status"
        :class="{
          'questionnairesCard__status--primary': value.questionStatus === false,
          'questionnairesCard__status--grey': value.questionStatus === true,
          'questionnairesCard__status--white': value.endDate && isExpired
        }"
        v-if="hasStatus"
        >{{
          value.questionStatus === true
            ? '已填'
            : value.endDate && isExpired
            ? '逾期'
            : '填答' || ''
        }}</span
      >
      <span
        class="questionnairesCard__date"
        :class="{
          'questionnairesCard__date--grey':
            value.status === 0 && type === 'announcements',
          'questionnairesCard__date--white': isExpired
        }"
        >{{ value.date ? value.date.split(' ')[0] : '無期限' }}</span
      >
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'

interface QuestionnairesCardProps {
  status: number
  date: string
  title: string
  serialno: string
  isPinned?: boolean
  questionStatus?: string
  endDate?: string
}

@Component
export default class QuestionnairesCard extends Vue {
  @Prop({
    type: Object,
    default() {
      return {}
    }
  })
  readonly value!: QuestionnairesCardProps

  @Prop({
    type: Boolean,
    default() {
      return false
    }
  })
  readonly hasStatus!: boolean

  @Prop({
    type: Boolean,
    default() {
      return false
    }
  })
  readonly hasPic!: boolean

  @Prop({
    type: String,
    default() {
      return 'announcements'
    }
  })
  readonly type!: 'announcements' | 'questionnaires'

  get isExpired() {
    if (this.value.endDate) {
      return new Date(this.value.endDate) > new Date()
    }
    return false
  }
}
</script>
<style lang="scss" scoped>
@import '../assets/scss/utils/variables';
@import '../assets/scss/utils/media';

.questionnairesCard {
  display: flex;
  align-items: flex-start;
  @include grid-md {
    align-items: center;
  }
  &__circle {
    width: 16px;
    height: 16px;
    margin-top: 2px;
    border-radius: 50%;
    background-color: $greyTwo;
    margin-bottom: $spacing-m;
    @include grid-md {
      width: 18px;
      height: 18px;
      margin-top: 0;
    }
    &--primary {
      background-color: $primary;
    }
    &--white {
      background-color: $whiteOne;
    }
  }
  &__description {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    margin-left: auto;
    width: 95%;
    padding-bottom: $spacing-m;
    border-bottom: 1px solid $greyThree;
    padding-left: $spacing-m;
    padding-right: $spacing-m;
    @include grid-md {
      padding-left: 0;
      padding-right: 0;
    }
  }
  &__text {
    flex: 0 0 100%;
    margin-bottom: $spacing-m;
    font-size: $fz-l;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
    @include grid-md {
      flex: 0 0 60%;
      margin-bottom: 0;
    }
    &:hover {
      color: $orange;
    }
    &--primary {
      &:hover {
        color: $primary;
      }
    }
    &--white {
      color: $whiteOne;
      &:hover {
        color: $whiteOne;
      }
    }
    &--grey {
      color: $greyTwo;
      &:hover {
        color: $greyThree;
      }
    }
  }
  &__pic {
    flex: 0 0 10%;
    height: 30px;
    width: 30px;
    line-height: 30px;
    background-position: center center;
    background-repeat: no-repeat;
    background-size: contain;
    @include grid-md {
      flex: 0 0 6%;
      margin-left: 2%;
      margin-right: 2%;
    }
  }
  &__icon {
    font-size: $fz-m;
    transform: rotate(45deg);
    margin: 0 $spacing-m;
  }
  &__status {
    flex: 0 0 30%;
    margin-left: 2%;
    margin-right: 2%;
    font-size: $fz-s;
    color: $greyThree;
    @include grid-md {
      flex: 0 0 6%;
    }
    &--primary {
      color: $primary;
    }
    &--grey {
      color: $greyTwo;
    }
    &--white {
      color: $whiteOne;
    }
  }
  &__date {
    flex: 0 0 30%;
    margin-left: auto;
    font-size: $fz-s;
    color: $greyThree;
    @include grid-md {
      flex: 0 0 9%;
      margin-left: 2%;
      margin-right: 2%;
    }
    &--grey {
      color: $greyTwo;
    }
  }
}
</style>
