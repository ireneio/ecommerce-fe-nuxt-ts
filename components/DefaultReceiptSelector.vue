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
      <b-form-radio value="2">STAYFUN 會員載具</b-form-radio>
      <b-form-radio value="3">雲端發票（手機載具）</b-form-radio>
      <b-form-radio value="4">雲端發票（自然人憑證）</b-form-radio>
      <b-form-radio value="5">三聯式發票</b-form-radio>
    </b-form-radio-group>
    <section
      class="defaultReceiptSelector__inputBox"
      v-if="value !== '1' || value !== ''"
    >
      <validation-observer>
        <validation-provider rules="required|max:50" v-slot="{ errors }">
          <base-label
            text="收件人"
            v-if="value === '2'"
            :valid="!errors.length"
            :hint="{ type: 'warning', text: errors.length ? errors[0] : '' }"
            :required="true"
          >
            <base-input :valid="!errors.length" v-model="form.receiver" />
          </base-label>
        </validation-provider>
        <base-label
          text="發票地址"
          v-if="value === '2' || value === '5'"
          :required="true"
        >
          <div class="addressBox">
            <div class="addressBox__area">
              <validation-provider rules="required" v-slot="{ errors }">
                <base-select
                  :valid="!errors.length"
                  v-model="form.addressArea"
                  :options="areaOptions"
                />
              </validation-provider>
            </div>
            <div class="addressBox__county">
              <validation-provider rules="required">
                <base-select
                  :valid="true"
                  v-model="form.addressCounty"
                  :disabled="!form.addressArea.length"
                  :options="countyOptions"
                />
              </validation-provider>
            </div>
            <div class="addressBox__line">
              <validation-provider rules="required|max:50" v-slot="{ errors }">
                <div class="addressBox__lineVal">
                  <span class="addressBox__lineZip">
                    {{ form.addressZipCode }}
                  </span>
                  <base-input
                    class="addressBox__lineInput"
                    :valid="!errors.length"
                    v-model="form.addressLine"
                    :disabled="!form.addressArea.length"
                  />
                </div>
              </validation-provider>
            </div>
          </div>
        </base-label>
        <validation-provider
          rules="required|isTaiwanMobileCarrier"
          v-slot="{ errors }"
        >
          <base-label
            text="條碼"
            v-if="value === '3'"
            :valid="!errors.length"
            :hint="{ type: 'warning', text: errors.length ? errors[0] : '' }"
            :required="true"
          >
            <base-input :valid="!errors.length" v-model="form.barcode" />
          </base-label>
        </validation-provider>
        <validation-provider
          rules="required|isTaiwanDigitalCert"
          v-slot="{ errors }"
        >
          <base-label
            text="條碼"
            v-if="value === '4'"
            :valid="!errors.length"
            :hint="{ type: 'warning', text: errors.length ? errors[0] : '' }"
            :required="true"
          >
            <base-input :valid="!errors.length" v-model="form.barcode" />
          </base-label>
        </validation-provider>
        <validation-provider rules="required|max:50" v-slot="{ errors }">
          <base-label
            text="公司名稱"
            v-if="value === '5'"
            :valid="!errors.length"
            :hint="{ type: 'warning', text: errors.length ? errors[0] : '' }"
            :required="true"
          >
            <base-input :valid="!errors.length" v-model="form.companyName" />
          </base-label>
        </validation-provider>
        <validation-provider
          rules="required|isTaiwanReceipt"
          v-slot="{ errors }"
        >
          <base-label
            text="統一編號"
            v-if="value === '5'"
            :valid="!errors.length"
            :hint="{ type: 'warning', text: errors.length ? errors[0] : '' }"
            :required="true"
          >
            <base-input :valid="!errors.length" v-model="form.identification" />
          </base-label>
        </validation-provider>
      </validation-observer>
    </section>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'nuxt-property-decorator'
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
    addressZipCode: '',
    barcode: '',
    companyName: '',
    identification: '',
    isValid: false
  }

  @Watch('form', { deep: true })
  public onFormChange(newVal: any) {
    this.$emit('form-update', newVal)
  }

  @Watch('isValid')
  public onValidChange(newVal: boolean) {
    this.form.isValid = newVal
  }

  get isValid() {
    if (this.value === '1') {
      return true
    }
    if (
      this.value === '4' &&
      /^[a-zA-Z]{2}[0-9]{14}$/.test(this.form.barcode)
    ) {
      return true
    }
    if (this.value === '3' && /^\/{1}[0-9A-Z]{7}$/.test(this.form.barcode)) {
      return true
    }
    if (this.value === '2' || this.value === '5') {
      if (this.value === '5' && !/^[0-9]{8}$/.test(this.form.identification)) {
        return false
      }
      if (
        this.form.addressArea !== '' &&
        this.form.addressCounty !== '' &&
        this.form.addressLine !== ''
      ) {
        return true
      }
    }
    return false
  }

  @Watch('form.addressArea')
  public onAddressAreaChange(newVal: string | number) {
    this.form.addressCounty = ''
    this.$emit('address-area-update', newVal)
  }

  @Watch('form.addressCounty')
  public onAddressCountyChange(newVal: string) {
    const zipCode = this.countyOptions
      .filter((item: any) => item.value === newVal)
      .map((item: any) => item.zipcode)
      .find((item: any, index: number) => index === 0)
    this.form.addressZipCode = zipCode
  }

  public handleOptionChange(e: any) {
    this.$emit('input', e)
    this.value = e
  }

  @Prop({
    type: Array,
    default() {
      return []
    }
  })
  readonly areaOptions!: any

  @Prop({
    type: Array,
    default() {
      return []
    }
  })
  readonly countyOptions!: any
}
</script>
<style lang="scss" scoped>
@import '../assets/scss/utils/variables';
@import '../assets/scss/utils/media';

.addressBox {
  display: flex;
  flex-wrap: wrap;
  &__area {
    flex: 0 0 100%;
    @include grid-md {
      flex: 0 0 25%;
      margin-right: $spacing-m;
    }
  }
  &__county {
    flex: 0 0 100%;
    @include grid-md {
      flex: 0 0 25%;
      margin-right: $spacing-m;
    }
  }
  &__line {
    flex: 0 0 100%;
    @include grid-md {
      flex: 0 0 calc(50% - 24px);
      margin-top: $spacing-xs + 1px;
    }
  }
  &__lineVal {
    display: flex;
    width: 100%;
    align-items: center;
  }
  &__lineZip {
    margin-right: $spacing-m;
    color: $greyThree;
    font-weight: bold;
  }
  &__lineInput {
    flex-grow: 1;
  }
}
.defaultReceiptSelector {
  &__inputBox {
    margin-top: $spacing-xl;
  }
}
</style>
