<template>
  <div class="defaultReceiptSelector">
    <b-form-radio-group
      id="defaultReceiptSelector"
      @input="handleOptionChange"
      name="defaultReceiptSelector"
    >
      <b-form-radio value="1">
        捐贈財團法人天主教華光社會福利基金會
      </b-form-radio>
      <b-form-radio value="2">
        StayFun會員載具
      </b-form-radio>
      <b-form-radio value="3">
        雲端發票（手機載具
      </b-form-radio>
      <b-form-radio value="4">
        雲端發票（自然人憑證）
      </b-form-radio>
      <b-form-radio value="5">
        三聯式發票
      </b-form-radio>
    </b-form-radio-group>
    <section
      class="defaultReceiptSelector__inputBox"
      v-if="value !== '1' || value !== ''"
    >
      <ValidationObserver>
        <ValidationProvider rules="required|max:50" v-slot="{ errors }">
          <BaseLabel
            text="收件人"
            v-if="value === '2'"
            :valid="!errors.length"
            :hint="{ type: 'warning', text: errors.length ? errors[0] : '' }"
          >
            <BaseInput :valid="!errors.length" v-model="form.receiver" />
          </BaseLabel>
        </ValidationProvider>
        <BaseLabel text="發票地址" v-if="value === '2' || value === '5'">
          <div class="addressBox">
            <div class="addressBox__area">
              <BaseSelect :valid="!errors.length" v-model="form.addressArea" />
            </div>
            <div class="addressBox__county">
              <BaseSelect
                :valid="!errors.length"
                v-model="form.addressCounty"
              />
            </div>
            <ValidationProvider rules="required|max:50" v-slot="{ errors }">
              <div class="addressBox__line">
                <BaseInput :valid="!errors.length" v-model="form.addressLine" />
              </div>
            </ValidationProvider>
          </div>
        </BaseLabel>
        <ValidationProvider rules="required|max:50" v-slot="{ errors }">
          <BaseLabel
            text="條碼"
            v-if="value === '3' || value === '4'"
            :valid="!errors.length"
            :hint="{ type: 'warning', text: errors.length ? errors[0] : '' }"
          >
            <BaseInput :valid="!errors.length" v-model="form.barcode" />
          </BaseLabel>
        </ValidationProvider>
        <ValidationProvider rules="required|max:50" v-slot="{ errors }">
          <BaseLabel
            text="公司名稱"
            v-if="value === '5'"
            :valid="!errors.length"
            :hint="{ type: 'warning', text: errors.length ? errors[0] : '' }"
          >
            <BaseInput :valid="!errors.length" v-model="form.companyName" />
          </BaseLabel>
        </ValidationProvider>
        <ValidationProvider rules="required|max:50" v-slot="{ errors }">
          <BaseLabel
            text="統一編號"
            v-if="value === '5'"
            :valid="!errors.length"
            :hint="{ type: 'warning', text: errors.length ? errors[0] : '' }"
          >
            <BaseInput :valid="!errors.length" v-model="form.identification" />
          </BaseLabel>
        </ValidationProvider>
      </ValidationObserver>
    </section>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import BaseInput from '~/components/BaseInput.vue'
import BaseLabel from '~/components/BaseLabel.vue'
import BaseSelect from '~/components/BaseSelect.vue'

@Component({
  components: {
    BaseInput,
    BaseLabel,
    ValidationObserver,
    ValidationProvider
  }
})
export default class DefaultReceiptSelector extends Vue {
  public value: '1' | '2' | '3' | '4' | '5' | '' = ''

  public form: any = {
    receiver: '',
    addressArea: '',
    addressCounty: '',
    addressLine: '',
    barcode: '',
    companyName: '',
    identification: ''
  }

  public handleOptionChange(e: any) {
    this.$emit('input', e)
    this.value = e
  }

  @Prop({
    type: Boolean,
    default() {
      return false
    }
  })
  readonly active!: boolean

  @Prop({
    type: Boolean,
    default() {
      return true
    }
  })
  readonly button!: boolean
}
</script>
<style lang="scss" scoped>
@import '../assets/scss/utils/variables';
@import '../assets/scss/utils/media';

.addressBox {
  display: flex;
  &__area {
    flex: 0 0 20%;
  }
  &__county {
    flex: 0 0 20%;
  }
  &__line {
    flex: 0 0 40%;
  }
}
.defaultReceiptSelector {
  &__inputBox {
    margin-top: $spacing-xl;
  }
}
</style>
