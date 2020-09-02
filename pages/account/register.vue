<template>
  <div>
    <h2 class="login__title">登入</h2>
    <b-container>
      <b-row>
        <b-col cols="24">
          <div class="login__hinttext loginInputMarginTop">
            <p>為確保您的帳戶安全，</p>
            <p>如帳戶名稱、密碼與訂單通知，請您輸入手機號碼進行認證</p>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import BaseInput from '~/components/BaseInput.vue'
import BaseCheckbox from '~/components/BaseCheckbox.vue'
import BaseButton from '~/components/BaseButton.vue'

@Component({
  layout: 'account',
  components: {
    BaseInput,
    BaseCheckbox,
    BaseButton
  }
})
export default class Register extends Vue {}
</script>
