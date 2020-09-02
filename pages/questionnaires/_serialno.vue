<template>
  <DefaultMainContainer
    title="返回調查所"
    :dark="true"
    :clickableTitle="true"
    route="questionnaires"
  >
    <b-container>
      <b-row>
        <b-col cols="24">
          <div class="questionnaireBlock questionnaireBlock--title">
            <h3 class="questionnaireBlock__title">午餐吃什麼</h3>
            <h4 class="questionnaireBlock__subtitle">所有題型測試</h4>
          </div>
        </b-col>
        <b-col cols="24" class="mt-5">
          <div class="questionnaireBlock questionnaireBlock--body">
            <div class="questionnaireBlock__questionTitleBlock">
              <h5 class="questionnaireBlock__questionTitle">1. 哪國料理</h5>
              <p class="questionnaireBlock__questionSubtitle">請給地址</p>
            </div>
            <div class="questionnaireBlock__questionDescriptionBlock">
              <p class="questionnaireBlock__questionDescriptionSubtitle">
                請給地址
              </p>
              <p class="questionnaireBlock__questionDescriptionInput">
                <input type="text" class="questionnaireBlock__input" />
              </p>
              <p class="questionnaireBlock__questionDescriptionInput">
                <label for="" class="questionnaireBlock__checkbox">
                  <input type="checkbox" class="questionnaireBlock__box" />
                  <span class="questionnaireBlock__boxLabel">1. 韓式料理</span>
                </label>
              </p>
              <p class="questionnaireBlock__questionDescriptionInput">
                <textarea cols="40" rows="5" class="questionnaireBlock__input">
                </textarea>
              </p>
            </div>
          </div>
        </b-col>
        <b-col cols="24" class="mt-5">
          <div class="questionnaireBlock questionnaireBlock--body">
            <div class="questionnaireBlock__questionTitleBlock">
              <h5 class="questionnaireBlock__questionTitle">4. 問卷滿意度</h5>
            </div>
            <b-container>
              <b-row>
                <b-col cols="4" offset="8">
                  <div class="questionnaireBlock__ratingbox">非常不喜歡</div>
                </b-col>
                <b-col cols="3">
                  <div class="questionnaireBlock__ratingbox">不喜歡</div>
                </b-col>
                <b-col cols="3">
                  <div class="questionnaireBlock__ratingbox">普通</div>
                </b-col>
                <b-col cols="3">
                  <div class="questionnaireBlock__ratingbox">喜歡</div>
                </b-col>
                <b-col cols="3">
                  <div class="questionnaireBlock__ratingbox">非常喜歡</div>
                </b-col>
              </b-row>
              <b-row class="pt-4">
                <b-col cols="8">
                  <span>清晰度</span>
                </b-col>
                <b-col :cols="i === 1 ? 4 : 3" v-for="i in 5" :key="i">
                  <div class="questionnaireBlock__ratingbox">
                    <input
                      type="radio"
                      class="questionnaireBlock__box"
                      name="clearness"
                    />
                  </div>
                </b-col>
              </b-row>
              <b-row class="pt-4">
                <b-col cols="8">
                  <span>重要度</span>
                </b-col>
                <b-col :cols="i === 1 ? 4 : 3" v-for="i in 5" :key="i">
                  <div class="questionnaireBlock__ratingbox">
                    <input
                      type="radio"
                      class="questionnaireBlock__box"
                      name="importance"
                    />
                  </div>
                </b-col>
              </b-row>
              <b-row class="pt-4">
                <b-col cols="8">
                  <span>貼切度</span>
                </b-col>
                <b-col :cols="i === 1 ? 4 : 3" v-for="i in 5" :key="i">
                  <div class="questionnaireBlock__ratingbox">
                    <input
                      type="radio"
                      class="questionnaireBlock__box"
                      name="magic"
                    />
                  </div>
                </b-col>
              </b-row>
            </b-container>
          </div>
        </b-col>
        <b-col cols="24" class="mt-5">
          <div class="questionnaireBlock__btn">
            <BaseButton type="primary">完成送出</BaseButton>
          </div>
        </b-col>
      </b-row>
    </b-container>
    <b-container>
      <b-row>
        <b-col cols="24">
          <div class="questionnaireBlock questionnaireBlock--title">
            <div class="questionnaireBlock__block">
              <h4 class="questionnaireBlock__titlesmall">
                編輯與查看已提交內容
              </h4>
              <BaseButton type="primary" class="questionnaireBlock__titlebtn">
                調查統計
              </BaseButton>
            </div>
            <b-container>
              <b-row>
                <b-col cols="13" class="px-0">
                  <div class="questionnaireBlock__listtitle">提交時間</div>
                </b-col>
                <b-col cols="11" class="px-0">
                  <div class="questionnaireBlock__listtitle">
                    更新時間
                  </div>
                </b-col>
              </b-row>
              <b-row>
                <b-col cols="13" class="px-0">
                  <div class="questionnaireBlock__listitem">
                    2020/08/23 12:16
                  </div>
                </b-col>
                <b-col cols="6" class="px-0">
                  <div class="questionnaireBlock__listitem">
                    2020/08/23 12:16
                  </div>
                </b-col>
                <b-col cols="5" class="px-0">
                  <div class="questionnaireBlock__listitem">
                    <span class="questionnaireBlock__link">編輯</span>
                  </div>
                </b-col>
              </b-row>
            </b-container>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </DefaultMainContainer>
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import DefaultMainContainer from '~/components/DefaultMainContainer.vue'
import { questionnairesStore } from '~/store'

interface questionnaireBlock {
  type: string
}
@Component({
  middleware: 'auth',
  components: {
    DefaultMainContainer
  }
})
export default class QuestionnairesDetail extends Vue {
  public async sendGetQuestionnairesDetailRequest() {
    try {
      await questionnairesStore.getQuestionnairesDetail({
        serialno: this.$route.params.serialno,
        token: this.$cookies.get('accessToken')
      })
    } catch (e) {
      // error
    }
  }

  public async fetch() {
    await this.sendGetQuestionnairesDetailRequest()
  }

  public activated() {
    this.$nextTick(async () => {
      this.$nuxt.$loading.start()
      await this.sendGetQuestionnairesDetailRequest()
      this.$nuxt.$loading.finish()
    })
  }
}
</script>
<style lang="scss" scoped>
@import '../../assets/scss/utils/variables';

.questionnaireBlock {
  background: #fff;
  font-weight: bold;
  &--title {
    padding: 40px $spacing-xxl;
  }
  &--body {
    padding: 30px $spacing-xxl;
  }
  &__btn {
    display: flex;
    justify-content: center;
  }
  &__block {
    display: flex;
    align-items: center;
  }
  &__listtitle {
    color: $greyTwo;
    font-size: $fz-s;
    margin-top: $spacing-m;
    padding-bottom: $spacing-m;
    border-bottom: 1px solid $greyTwo;
  }
  &__listitem {
    margin-top: $spacing-m;
    margin-bottom: $spacing-m;
  }
  &__link {
    color: $primary;
    cursor: pointer;
  }
  &__titlesmall {
    font-size: $fz-m;
    font-weight: bold;
  }
  &__titlebtn {
    margin-left: auto;
  }
  &__title {
    font-size: $fz-xxl;
    color: $greyThree;
    font-weight: bold;
  }
  &__subtitle {
    color: $greyTwo;
    font-size: $fz-xl;
    margin-top: $spacing-xl;
    font-weight: bold;
  }
  &__questionTitleBlock {
    border-bottom: 1px solid $greyThree;
    padding-bottom: $spacing-m;
    font-weight: bold;
    margin-bottom: $spacing-m;
  }
  &__questionTitle {
    color: $greyThree;
    font-size: $fz-m;
    font-weight: bold;
    padding-bottom: $spacing-s;
  }
  &__questionSubtitle {
    color: $greyFive;
    font-size: $fz-s;
  }
  &__questionDescriptionSubtitle {
    color: $greyFive;
    padding-bottom: $spacing-m;
  }
  &__questionDescriptionInput {
    margin-bottom: $spacing-m;
  }
  &__input {
    border-radius: 4px;
    border: 1px solid $greyThree;
    padding: $spacing-xs $spacing-s;
    &:focus {
      border: 1px solid $primary;
      box-shadow: 0px 2px 6px $orangeDark;
    }
  }
  &__checkbox {
    display: flex;
    align-items: center;
  }
  &__box {
    font-size: $fz-s;
    width: 20px;
    height: 20px;
  }
  &__boxLabel {
    margin-left: $spacing-s;
  }
  &__ratingbox {
    text-align: center;
  }
}
</style>
