<template>
  <default-main-container title="聯絡我們">
    <b-container>
      <b-row>
        <b-col>
          <div class="contact">
            <p class="contact__item">客服專線：(02) 6617-7100</p>
            <p class="contact__item">E-mail：stayfun_service@mayohr.com</p>
            <p class="contact__item">
              服務時間：週一至週五9:00~18:00 (不含週六、日與國定例假日)
            </p>
            <p class="contact__item">
              請於服務時間來電，客服人員將盡速為您處理與回覆。
            </p>
            <div class="contact__btn">
              <button class="contactBtn">線上客服</button>
            </div>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </default-main-container>
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import DefaultMainContainer from '~/components/DefaultMainContainer.vue'

@Component({
  layout: 'default',
  middleware: 'auth',
  components: {
    DefaultMainContainer
  }
})
export default class Contact extends Vue {
  private head() {
    return {
      title: 'STAYFUN員工福利整合平台 | 聯絡資訊',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'STAYFUN員工福利整合平台 | 聯絡資訊'
        },
        {
          hid: 'og:title',
          name: 'og:title',
          content: 'STAYFUN員工福利整合平台 | 聯絡資訊'
        },
        {
          hid: 'og:type',
          name: 'og:type',
          content: 'STAYFUN員工福利整合平台'
        },
        {
          hid: 'og:description',
          name: 'og:type',
          content: 'STAYFUN員工福利整合平台 | 聯絡資訊'
        }
      ]
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../assets/scss/utils/variables';

.contact {
  font-size: 1rem;
  &__item {
    padding-bottom: $spacing-l;
  }
  &__btn {
    margin-top: $spacing-xxl;
  }
}

.contactBtn {
  padding: 5px 25px;
  font-weight: bold;
  font-size: 1rem;
  letter-spacing: 2px;
  border: none;
  border-radius: 5px;
  background-color: $orangeLight;
  color: $brown;
}
</style>
