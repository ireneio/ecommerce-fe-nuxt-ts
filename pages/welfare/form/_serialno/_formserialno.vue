<template>
  <div>
    <WelfareContainer>
      <template v-slot:header>
        <header class="welfareFormHeader">
          <h4 class="welfareFormHeader__title">
            {{ formInfo.sheetName }}
          </h4>
          <h5 class="welfareFormHeader__subtitle">
            {{ formInfo.documentNumber }}
          </h5>
          <span class="welfareFormHeader__date">
            更新時間：{{ latestUpdatedDateTime }}
          </span>
          <p class="welfareFormHeader__desc">
            {{ formInfo.description }}
          </p>
        </header>
      </template>
      <ValidationObserver>
        <section class="welfareForm">
          <b-container fluid>
            <b-row>
              <b-col cols="24" lg="12" class="mb-5">
                <ValidationProvider v-slot="{ errors }" rules="max:50|required">
                  <BaseLabel
                    text="填表人"
                    required
                    :valid="!errors.length"
                    :hint="{
                      text: errors.length ? errors[0] : '必填',
                      type: 'warning'
                    }"
                  >
                    <BaseInput
                      type="text"
                      required
                      v-model="basicInfo.creatorChineseName"
                      placeholder="請輸入真實姓名"
                      :valid="!errors.length"
                    />
                  </BaseLabel>
                </ValidationProvider>
              </b-col>
              <b-col cols="24" lg="12" class="mb-5">
                <BaseLabel text="填表人帳號">
                  <BaseInput type="text" readonly :value="userId" />
                </BaseLabel>
              </b-col>
              <b-col cols="24" lg="12" class="mb-5">
                <ValidationProvider v-slot="{ errors }" rules="max:50|required">
                  <BaseLabel
                    text="申請人帳號"
                    required
                    :valid="!errors.length"
                    :hint="{
                      text: errors.length ? errors[0] : '必填',
                      type: 'warning'
                    }"
                  >
                    <BaseInput
                      type="text"
                      required
                      v-model="basicInfo.applicantId"
                      placeholder="請輸入真實帳號"
                      :valid="!errors.length"
                    />
                  </BaseLabel>
                </ValidationProvider>
              </b-col>
              <b-col cols="24" lg="12" class="mb-5">
                <BaseLabel text="補助金額">
                  <BaseInput
                    type="text"
                    required
                    readonly
                    :value="baseAllowance"
                  />
                </BaseLabel>
              </b-col>
              <b-col
                cols="24"
                :md="
                  col.columnId === 'Remarks' || col.columnId === 'RelatedFiles'
                    ? '24'
                    : '12'
                "
                class="mb-5"
                v-for="col in formCols"
                :key="col.columnId"
                v-show="col.isDisplay"
              >
                <ValidationProvider v-slot="{ errors }" rules="max:50|required">
                  <BaseLabel
                    :text="col.columnName"
                    :required="col.isRequired"
                    :valid="!errors.length"
                    :hint="{
                      text: errors.length ? errors[0] : '必填',
                      type: 'warning'
                    }"
                    v-if="
                      col.type === 'text' ||
                      col.type === 'email' ||
                      col.type === 'password'
                    "
                  >
                    <BaseInput
                      v-if="
                        col.type === 'text' ||
                        col.type === 'email' ||
                        col.type === 'password'
                      "
                      :type="col.type"
                      v-model="form[col.columnId]"
                      :placeholder="col.placeholder ? col.placeholder : ''"
                      :valid="!errors.length"
                    />
                  </BaseLabel>
                </ValidationProvider>
                <ValidationProvider v-slot="{ errors }" rules="required">
                  <BaseLabel
                    :text="col.columnName"
                    :required="col.isRequired"
                    :valid="!errors.length"
                    :hint="{
                      text: errors.length ? errors[0] : '必填',
                      type: 'warning'
                    }"
                    v-if="
                      col.type === 'date' ||
                      col.type === 'files' ||
                      col.type === 'radio' ||
                      col.type === 'select'
                    "
                  >
                    <BaseDatepicker
                      format="YYYY/MM/DD"
                      v-model="form[col.columnId]"
                      :valid="!errors.length"
                      :placeholder="col.placeholder ? col.placeholder : ''"
                      :disabledDates="
                        col.columnId === 'HappenDate'
                          ? happenDateIntervals.min !== null &&
                            happenDateIntervals.max !== null
                            ? (date) =>
                                date < happenDateIntervals.min ||
                                date > happenDateIntervals.max
                            : (date) => false
                          : (date) => false
                      "
                      v-if="col.type === 'date'"
                    />
                    <BaseFile
                      :placeholder="col.placeholder ? col.placeholder : ''"
                      :valid="!errors.length"
                      id="file"
                      @change="handleFileInput($event, form[col.columnId])"
                      v-if="col.type === 'files'"
                    />
                    <b-form-radio-group
                      :id="col.columnId"
                      v-model="form[col.columnId]"
                      :name="col.columnId"
                      v-if="col.type === 'radio'"
                    >
                      <b-form-radio
                        :value="value"
                        v-for="(value, key) in colsMap[col.columnId].values"
                        :key="key"
                      >
                        {{ key }}
                      </b-form-radio>
                    </b-form-radio-group>
                    <BaseSelect
                      v-if="col.type === 'select'"
                      :placeholder="col.placeholder ? col.placeholder : ''"
                      v-model="form[col.columnId]"
                      :options="colsMap[col.columnId].values"
                      :valid="!errors.length"
                    />
                  </BaseLabel>
                </ValidationProvider>
                <ValidationProvider v-slot="{ errors }" rules="max:150">
                  <BaseLabel
                    :text="col.columnName"
                    :required="false"
                    :valid="!errors.length"
                    :hint="{
                      text: errors.length ? errors[0] : '必填',
                      type: 'warning'
                    }"
                    v-if="col.type === 'textarea'"
                  >
                    <BaseTextarea
                      v-if="col.type === 'textarea'"
                      v-model="form[col.columnId]"
                      :placeholder="col.placeholder ? col.placeholder : ''"
                      :valid="!errors.length"
                    />
                  </BaseLabel>
                </ValidationProvider>
              </b-col>
            </b-row>
            <b-row class="mt-5">
              <b-col cols="24" lg="12" xl="9">
                <div class="welfareForm__btngroup">
                  <span class="welfareForm__btn">
                    <BaseButton type="greyTwoOutline" @click="handleDelete">
                      刪除
                    </BaseButton>
                  </span>
                  <span class="welfareForm__btn">
                    <BaseButton type="greyTwo" @click="handlePrint">
                      列印
                    </BaseButton>
                  </span>
                  <span class="welfareForm__btn">
                    <BaseButton
                      :type="confirmDisabled ? 'greyOne' : 'greyTwo'"
                      @click="handleSubmit(0)"
                      :disabled="confirmDisabled"
                    >
                      暫存
                    </BaseButton>
                  </span>
                </div>
              </b-col>
              <b-col cols="24" lg="12" xl="15" class="mt-5 mt-lg-0">
                <BaseButton
                  :type="submitDisabled ? 'greyOne' : 'primary'"
                  display="block"
                  @click="handleSubmit(1)"
                  :disabled="submitDisabled"
                >
                  送出
                </BaseButton>
              </b-col>
            </b-row>
          </b-container>
        </section>
      </ValidationObserver>
    </WelfareContainer>
    <DefaultDialog
      :active="dialogState"
      @cancel="handleDialogClose"
      @accept="handleDialogClose"
      @confirm="handleDialogConfirm"
      :message="dialogContent.message"
      :title="dialogContent.title"
      :type="dialogContent.type"
      :icon="dialogContent.icon"
    >
    </DefaultDialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { ProxyRequestObject, ResponseObject } from 'Http'
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import WelfareContainer from '~/components/WelfareContainer.vue'
import BaseInput from '~/components/BaseInput.vue'
import BaseSelect from '~/components/BaseSelect.vue'
import BaseFile from '~/components/BaseFile.vue'
import BaseButton from '~/components/BaseButton.vue'
import BaseLabel from '~/components/BaseLabel.vue'
import BaseTextarea from '~/components/BaseTextarea.vue'
import BaseDatepicker from '~/components/BaseDatepicker.vue'
import DefaultDialog from '~/components/DefaultDialog.vue'
import { $axios } from '~/utils/api'
import { welfareStore, dialogStore } from '~/store'

@Component({
  middleware: 'auth',
  components: {
    WelfareContainer,
    BaseInput,
    BaseSelect,
    BaseFile,
    BaseButton,
    BaseLabel,
    BaseTextarea,
    BaseDatepicker,
    DefaultDialog,
    ValidationObserver,
    ValidationProvider
  }
})
export default class WelfareForm extends Vue {
  get dialogState() {
    return dialogStore.active
  }

  get dialogContent() {
    return dialogStore.content
  }

  public async handleDialogConfirm() {
    dialogStore.setActive(false)
    dialogStore.setMaskActive(false)
    if (dialogStore.content.initializer === 'welfare-form-delete') {
      try {
        this.$nuxt.$loading.start()
        await this.sendDeleteFormRequest()
        this.$router.push('/welfare/reportlist')
      } catch (e) {
        dialogStore.setActive(true)
        dialogStore.setMaskActive(true)
        dialogStore.setContent({
          title: '系統異常！',
          message: '請聯絡 STAYFUN 客服人員。',
          icon: true,
          type: 'accept',
          initializer: 'welfare-error'
        })
      } finally {
        this.$nuxt.$loading.finish()
      }
    }
  }

  public handleDialogClose() {
    dialogStore.setActive(false)
    dialogStore.setMaskActive(false)

    if (dialogStore.content.initializer === 'welfare-submit-success') {
      this.$router.push('/welfare/reportlist')
    }
  }

  get submitDisabled() {
    return Object.keys(this.form).findIndex(
      (key: any) =>
        this.form[key] === '' && key !== 'RelatedFiles' && key !== 'Remarks'
    ) > -1 || Object.keys(welfareStore.formNew).length
      ? welfareStore.formNew.status === 1
      : false
  }

  get confirmDisabled() {
    return Object.keys(welfareStore.formNew).length
      ? welfareStore.formNew.status === 1
      : false
  }

  get happenDateIntervals() {
    const find = this.formCols.find(
      (item: any) => item.columnId === 'HappenDate'
    )
    if (find) {
      const maxDate = new Date()
      maxDate.setDate(
        maxDate.getDate() + Number(find.extraInformation.nextNDays)
      )
      const minDate = new Date()
      minDate.setDate(
        minDate.getDate() - Number(find.extraInformation.pastNDays) - 1
      )
      return {
        max: maxDate.toString() === 'Invalid Date' ? null : maxDate,
        min: minDate.toString() === 'Invalid Date' ? null : minDate,
        interval: find.intervalDays
      }
    } else {
      return {
        max: null,
        min: null,
        interval: null
      }
    }
  }

  public colsMap: any = {
    Remarks: { type: 'textarea', placeholder: '請輸入備註' },
    HappenDate: { type: 'date', placeholder: '請輸入日期' },
    Applicant: { type: 'text', placeholder: '請輸入真實姓名' },
    RelatedFiles: { type: 'files', placeholder: '請上傳檔案' },
    RelationshipWithDeceased: {
      type: 'select',
      values: [
        { label: '配偶', value: 1, id: '1' },
        { label: '父親', value: 2, id: '2' },
        { label: '母親', value: 3, id: '3' },
        { label: '子', value: 4, id: '4' },
        { label: '女', value: 5, id: '5' },
        { label: '申請者本人', value: 6, id: '6' }
      ],
      placeholder: '請選擇'
    },
    ElegiacCoupletOrNot: { type: 'radio', values: { 是: true, 否: false } },
    ElegiacCoupletArrivedDate: { type: 'date', placeholder: '請輸入日期' },
    DeceasedName: { type: 'text', placeholder: '請輸入真實姓名' },
    DeceasedAge: { type: 'text', placeholder: '請輸入真實年齡' },
    DeceasedGender: { type: 'radio', values: { 男: true, 女: false } },
    ContactName: { type: 'text', placeholder: '請輸入真實姓名' },
    ContactPhone: { type: 'text', placeholder: '請輸入電話號碼' },
    ContactAddress: { type: 'text', placeholder: '請輸入完整地址' },
    Babies: { type: 'text', placeholder: '請輸入數量' }
  }

  public form: any = {}

  public basicInfo: any = {
    applicantId: '',
    creatorChineseName: ''
  }

  public async handleSubmit(status: 0 | 1) {
    this.$nuxt.$loading.start()
    try {
      await this.sendSaveRequest(status)
      dialogStore.setActive(true)
      dialogStore.setMaskActive(true)
      dialogStore.setContent({
        title: status === 0 ? '暫存成功' : '送出成功',
        icon: true,
        type: 'accept',
        initializer: 'welfare-submit-success'
      })
    } catch (e) {
      dialogStore.setActive(true)
      dialogStore.setMaskActive(true)
      dialogStore.setContent({
        title: '系統異常！',
        message: e.message,
        icon: true,
        type: 'accept',
        initializer: 'welfare-error'
      })
    } finally {
      this.$nuxt.$loading.finish()
    }
  }

  public handleDelete() {
    dialogStore.setActive(true)
    dialogStore.setMaskActive(true)
    dialogStore.setContent({
      title: '確定要刪除嗎？進度將無法復原。',
      icon: true,
      type: 'confirm',
      initializer: 'welfare-form-delete'
    })
  }

  public handlePrint() {
    window.print()
  }

  public async handleFileInput(fileArr: Array<any>): Promise<any> {
    const formData = new FormData()
    fileArr.forEach((file: any) => {
      formData.append('files', file)
    })
    this.form.RelatedFiles = formData
    try {
      await this.sendFileUploadRequest()
    } catch (e) {
      // file upload error
      dialogStore.setActive(true)
      dialogStore.setMaskActive(true)
      dialogStore.setContent({
        title: '系統異常！',
        message: '請聯絡 STAYFUN 客服人員。',
        icon: true,
        type: 'accept',
        initializer: 'welfare-error'
      })
    }
  }

  get formInfo() {
    return welfareStore.formInfo
  }

  get formCols() {
    return welfareStore.formCols.map((item: any) => ({
      ...item,
      placeholder: this.colsMap[item.columnId].placeholder
        ? this.colsMap[item.columnId].placeholder
        : '',
      type: this.colsMap[item.columnId].type
    }))
  }

  get userName() {
    return welfareStore.userName
  }

  get userId() {
    return welfareStore.userId
  }

  get baseAllowance() {
    return welfareStore.formNew
      ? welfareStore.formNew.baseAllowance
        ? welfareStore.formNew.baseAllowance.toString()
        : '0'
      : '0'
  }

  get formId() {
    return welfareStore.formNew.id
  }

  get latestUpdatedDateTime() {
    return welfareStore.latestUpdatedDateTime
  }

  public async sendFileUploadRequest() {
    this.form.RelatedFiles.append('FormId', this.$route.params.formserialno)
    const requestBody: any = {
      endpoint: '/api/welfare/applicationForm/insertFiles',
      key: process.env.apiKey,
      data: this.form.RelatedFiles,
      method: 'post',
      token: this.$cookies.get('accessToken')
    }
    Object.keys(requestBody).forEach((key: string) => {
      this.form.RelatedFiles.append(key, requestBody[key])
    })

    const result: ResponseObject = await $axios.post(
      '/api',
      this.form.RelatedFiles
    )
    this.form.RelatedFiles = new FormData()

    // clear file for chrome
    const fileTag: any = document.querySelector('#file')
    fileTag.value = ''

    switch (result.data.syscode) {
      case 200:
        return result.data.data
      case 4037:
        throw new Error('Not Found')
      case 500:
        throw new Error('Server Error')
      default:
        return null
    }
  }

  public async sendSaveRequest(status: 0 | 1) {
    const requestBody: ProxyRequestObject = {
      endpoint: `/api/welfare/apply/${this.$route.params.formserialno}`,
      key: process.env.apiKey,
      data: {
        id: this.$route.params.formserialno,
        status,
        applicantChineseName: this.form.Applicant,
        applicantId: this.basicInfo.applicantId,
        creatorChineseName: this.basicInfo.creatorChineseName,
        columns: {
          ...this.form
        }
      },
      method: 'patch',
      token: this.$cookies.get('accessToken')
    }
    delete requestBody.data.columns.RelatedFiles
    delete requestBody.data.columns.applicantChineseName

    const result: ResponseObject = await $axios.post('/api', requestBody)
    switch (result.data.syscode) {
      case 200:
        return result.data.data
      case 6002:
        throw new Error(
          '此表單的申請次數已達上限，請⾄申請紀錄查看過去提交紀錄。'
        )
      case 4037:
        throw new Error(result.data.sysmsg)
      case 500:
        throw new Error('Server Error')
      default:
        return null
    }
  }

  public async sendDeleteFormRequest() {
    const requestBody: ProxyRequestObject = {
      endpoint: `/api/welfare/applicationForm/delete?id=${this.formId}`,
      key: process.env.apiKey,
      method: 'get',
      token: this.$cookies.get('accessToken')
    }

    const result: ResponseObject = await $axios.post('/api', requestBody)
    switch (result.data.syscode) {
      case 200:
        return result.data.data
      case 4037:
        throw new Error('Not Found')
      case 500:
        throw new Error('Server Error')
      default:
        return null
    }
  }

  public async sendGetFormDataRequest() {
    try {
      await welfareStore.getFormData({
        serialno: this.$route.params.serialno,
        token: this.$cookies.get('accessToken')
      })
    } catch (e) {}
  }

  public async sendAuthorizeRequest() {
    try {
      await welfareStore.getAuthorized({
        token: this.$cookies.get('accessToken')
      })
    } catch (e) {
      // not authorized to access forms
      dialogStore.setActive(true)
      dialogStore.setMaskActive(true)
      dialogStore.setContent({
        title: '申請次數已達上限',
        icon: true,
        type: 'accept',
        initializer: 'welfare-max-limit'
      })
      this.$router.push('/')
    }
  }

  public async sendGetLatestRequest() {
    try {
      await welfareStore.getLatest({
        serialno: this.$route.params.formserialno,
        token: this.$cookies.get('accessToken')
      })
    } catch (e) {
      // error
    }
  }

  public async fetch() {
    try {
      await this.sendAuthorizeRequest()
      await this.sendGetFormDataRequest()
      await this.sendGetLatestRequest()

      this.formCols.forEach((item: any) => {
        const defaultValue = item.type !== 'radio' ? '' : true
        this.$set(this.form, item.columnId, defaultValue)
      })
      if (Object.keys(welfareStore.formFilledCols).length) {
        Object.keys(welfareStore.formFilledCols).forEach((key) => {
          this.form[key] = welfareStore.formFilledCols[key]
        })
      }

      this.basicInfo.applicantId = welfareStore.formNew.applicantId
      this.basicInfo.creatorChineseName =
        welfareStore.formNew.creatorChineseName
    } catch (e) {
      dialogStore.setActive(true)
      dialogStore.setMaskActive(true)
      dialogStore.setContent({
        title: '系統異常！',
        message: e,
        icon: true,
        type: 'accept',
        initializer: 'welfare-error'
      })
    }
  }

  public activated() {
    this.$nextTick(async () => {
      this.$nuxt.$loading.start()

      try {
        await this.sendAuthorizeRequest()
        await this.sendGetFormDataRequest()
        await this.sendGetLatestRequest()

        this.formCols.forEach((item: any) => {
          this.$set(this.form, item.columnId, '')
        })
        if (Object.keys(welfareStore.formFilledCols).length) {
          Object.keys(welfareStore.formFilledCols).forEach((key) => {
            this.form[key] = welfareStore.formFilledCols[key]
          })
        }

        this.basicInfo.applicantId = welfareStore.formNew.applicantId
        this.basicInfo.creatorChineseName =
          welfareStore.formNew.creatorChineseName
      } catch (e) {
        dialogStore.setActive(true)
        dialogStore.setMaskActive(true)
        dialogStore.setContent({
          title: '系統異常！',
          message: e,
          icon: true,
          type: 'accept',
          initializer: 'welfare-error'
        })
      } finally {
        this.$nuxt.$loading.finish()
      }
    })
  }

  // @typescript-eslint/no-unused-vars
  public beforeRouteEnter(to: any, from: any, next: any) {
    if (
      to.params.serialno === '' ||
      to.params.serialno === undefined ||
      to.params.formserialno === '' ||
      to.params.formserialno === undefined
    ) {
      next('/welfare')
    } else next()
  }
}
</script>
<style lang="scss" scoped>
@import '../../../../assets/scss/utils/variables';
@import '../../../../assets/scss/utils/media';

.welfareForm {
  &__btn {
    margin-right: $spacing-xs;
    margin-top: $spacing-xs;
    @include grid-md {
      flex: 0 0 auto;
      margin-right: $spacing-m;
    }
  }
  &__btngroup {
    display: flex;
    flex-wrap: wrap;
  }
}
.welfareFormHeader {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  background-color: $whiteTwo;
  padding: $spacing-xl;
  border-radius: 4px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  &__title {
    order: 0;
    color: $greyThree;
    font-weight: bold;
    font-size: $fz-l;
  }
  &__subtitle {
    flex: 0 0 100%;
    order: 4;
    color: $greyTwo;
    font-size: $fz-s;
    margin-top: $spacing-m;
    @include grid-md {
      flex: 0 0 auto;
      order: 2;
      margin-left: $spacing-m;
      margin-top: 0;
    }
  }
  &__desc {
    flex: 0 0 100%;
    order: 4;
    font-size: $fz-s;
    margin-top: $spacing-m;
    // background-color: #fff;
    // margin: 0 -$spacing-xl;
  }
  &__date {
    flex: 0 0 100%;
    order: 5;
    font-weight: bold;
    margin-top: $spacing-m;
    @include grid-md {
      flex: 0 0 auto;
      order: 3;
      margin-left: auto;
      margin-top: 0;
    }
  }
}
</style>
