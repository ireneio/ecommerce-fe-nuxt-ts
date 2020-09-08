<template>
  <div>
    <welfare-container
      title="我的簽核"
      :isAuthorized="authorized"
      @input="searchParams.SearchText = $event"
      @click="handleSearch"
      @keydown-enter="handleSearch"
    >
      <div class="welfareRecord">
        <div class="welfareRecord__btnbox">
          <base-button
            :type="selected.length ? 'primary' : 'greyOne'"
            @click="handleVerificationModalOpen"
            :disabled="!selected.length"
          >
            批次簽核
          </base-button>
          <span class="welfareRecord__btntext">
            已勾選 {{ selected.length }} 筆
          </span>
        </div>
        <client-only>
          <vue-good-table
            :columns="tableFields"
            :rows="signingList"
            :line-numbers="true"
            :total-rows="signingListDataLength"
            :pagination-options="{
              enabled: true,
              mode: 'remote',
              perPage: pagination.length,
              position: 'bottom',
              perPageDropdown: [5, 10, 15, 20],
              dropdownAllowAll: false,
              setCurrentPage: pagination.start / pagination.length + 1,
              nextLabel: '下一頁',
              prevLabel: '上一頁',
              rowsPerPageLabel: '每頁筆數',
              ofLabel: '共',
              pageLabel: '', // for 'pages' mode
              allLabel: '全部'
            }"
            :select-options="{
              enabled: true,
              selectOnCheckboxOnly: true, // only select when checkbox is clicked instead of the row
              selectionInfoClass: 'custom-class',
              selectionText: '筆已勾選',
              clearSelectionText: '清除',
              disableSelectInfo: true, // disable the select info panel on top
              selectAllByGroup: true // when used in combination with a grouped table, add a checkbox in the header row to check/uncheck the entire group
            }"
            @on-page-change="handlePageUpdate"
            @on-per-page-change="handlePageLengthUpdate"
            @on-cell-click="handleCellClick"
            @on-selected-rows-change="handleSelectionChanged"
          >
            <div slot="emptystate">
              無資料
            </div>
            <template slot="table-row" slot-scope="props">
              <span v-if="props.column.field == 'application'">
                <div class="welfareRecord__tablerow">
                  <p class="welfareRecord__text">{{ props.row.application }}</p>
                  <p class="welfareRecord__subtext">
                    {{ props.row.applicationId }}
                  </p>
                </div>
              </span>
              <span v-if="props.column.field == 'time'">
                <div class="welfareRecord__tablerow">
                  <p class="welfareRecord__text">{{ props.row.time }}</p>
                </div>
              </span>
              <span v-if="props.column.field == 'applier'">
                <div class="welfareRecord__tablerow">
                  <p class="welfareRecord__text">{{ props.row.applier }}</p>
                </div>
              </span>
              <span v-if="props.column.field == 'applierId'">
                <div class="welfareRecord__tablerow">
                  <p class="welfareRecord__text">{{ props.row.applierId }}</p>
                </div>
              </span>
              <span v-if="props.column.field == 'status'">
                <div class="welfareRecord__tablerow welfareRecord__rowStatus">
                  <span
                    class="welfareRecord__badge"
                    　:class="{
                      'welfareRecord__badge--primary':
                        props.row.status === '暫存' ||
                        props.row.status === '待補件',
                      'welfareRecord__badge--secondary':
                        props.row.status === '待簽核',
                      'welfareRecord__badge--greyOne':
                        props.row.status === '駁回',
                      'welfareRecord__badge--greyTwo':
                        props.row.status === '同意'
                    }"
                  >
                    {{ props.row.status }}
                  </span>
                </div>
              </span>
            </template>

            <template slot="table-column" slot-scope="props">
              <div class="welfareRecord__tableheadingtext">
                {{ props.column.label }}
              </div>
            </template>
          </vue-good-table>
        </client-only>
      </div>
    </welfare-container>
    <client-only>
      <default-dialog
        :active="dialogState"
        @accept="handleDialogClose"
        @confirm="handleDialogConfirm"
        @cancel="handleDialogClose"
        :message="dialogContent.message"
        :title="dialogContent.title"
        :type="dialogContent.type"
        :icon="dialogContent.icon"
      ></default-dialog>
    </client-only>
    <client-only>
      <default-modal :active="modalState" @click="handleModalClose">
        <div class="signingModal">
          <div class="signingModal__title">簽核結果</div>
          <validation-observer v-slot="{ invalid }">
            <validation-provider rules="required" v-slot="{ errors }">
              <div class="signingModal__content">
                <base-label
                  text="狀態"
                  :required="true"
                  :hint="{
                    type: 'warning',
                    text: errors.length ? errors[0] : ''
                  }"
                  :valid="!errors.length"
                >
                  <b-form-radio-group
                    id="radio-group-2"
                    v-model="form.signingStatus"
                    name="radio-sub-component2"
                  >
                    <b-form-radio :value="2">需補件</b-form-radio>
                    <b-form-radio :value="4">同意</b-form-radio>
                    <b-form-radio :value="5">駁回</b-form-radio>
                  </b-form-radio-group>
                </base-label>
              </div>
            </validation-provider>
            <validation-provider rules="required|max:50" v-slot="{ errors }">
              <div class="signingModal__content">
                <base-label
                  text="意見回覆"
                  :hint="{
                    type: 'warning',
                    text: errors.length ? errors[0] : ''
                  }"
                  :valid="!errors.length"
                  :required="true"
                >
                  <base-input v-model="form.opinion" :valid="!errors.length" />
                </base-label>
              </div>
            </validation-provider>
            <div class="signingModal__btnbox">
              <base-button type="greyTwo" @click="handleModalClose">
                取消
              </base-button>
              <base-button
                :type="invalid ? 'greyOne' : 'primary'"
                display="block"
                class="signingModal__btn"
                :disabled="invalid"
                @click="handleConfirmBatchSigning"
              >
                送出
              </base-button>
            </div>
          </validation-observer>
        </div>
      </default-modal>
    </client-only>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import { ProxyRequestObject, ResponseObject } from 'Http'
import { $axios } from '~/utils/api'
import WelfareContainer from '~/components/WelfareContainer.vue'
import DefaultDialog from '~/components/DefaultDialog.vue'
import BaseButton from '~/components/BaseButton.vue'
import BaseLabel from '~/components/BaseLabel.vue'
import BaseInput from '~/components/BaseInput.vue'
import DefaultModal from '~/components/DefaultModal.vue'
import { welfareStore, dialogStore } from '~/store'

interface TableData {
  id: string
  time: string
  application: string
  applicationId: string
  applier: string
  verification: string
  status: string
}

interface TableField {
  label: string
  field: string
  class?: string
  thClass?: string
  dateInputFormat?: string
  dateOutputFormat?: string
  type?: string
}

@Component({
  middleware: 'auth',
  components: {
    WelfareContainer,
    DefaultDialog,
    BaseButton,
    BaseLabel,
    BaseInput,
    ValidationObserver,
    ValidationProvider
  }
})
export default class WelfareRecord extends Vue {
  private head() {
    return {
      title: 'STAYFUN員工福利整合平台 | 我的簽核',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'STAYFUN員工福利整合平台 | 我的簽核'
        },
        {
          hid: 'og:title',
          name: 'og:title',
          content: 'STAYFUN員工福利整合平台 | 我的簽核'
        },
        {
          hid: 'og:type',
          name: 'og:type',
          content: 'STAYFUN員工福利整合平台'
        },
        {
          hid: 'og:description',
          name: 'og:type',
          content: 'STAYFUN員工福利整合平台 | 我的簽核'
        }
      ]
    }
  }

  private modalState: boolean = false

  private handleConfirmBatchSigning(): void {
    this.handleModalClose()
    dialogStore.setActive(true)
    dialogStore.setMaskActive(true)
    dialogStore.setContent({
      title: '確定要送出？',
      message: '送出後無法再修改，請問是否需送出？',
      type: 'confirm',
      icon: true,
      initializer: 'batch-signing-confirm'
    })
  }

  private async handleBatchSigning() {
    try {
      this.$nuxt.$loading.start()
      await this.sendBatchSigningRequest()
      dialogStore.setActive(true)
      dialogStore.setMaskActive(true)
      dialogStore.setContent({
        title: '您的簽核已成功發送',
        type: 'accept',
        icon: true,
        initializer: 'batch-signing-success'
      })
    } catch (e) {
      dialogStore.setActive(true)
      dialogStore.setMaskActive(true)
      dialogStore.setContent({
        title: e.message,
        // title: '您的請求無法被完成，請稍後再試。',
        icon: true,
        type: 'accept'
      })
    } finally {
      this.form = {
        signingStatus: '',
        opinion: ''
      }
      this.selected = []
      this.$nuxt.$loading.finish()
    }
  }

  private handleVerificationModalOpen(): void {
    dialogStore.setMaskActive(true)
    this.modalState = true
  }

  private async handleDialogConfirm() {
    if (dialogStore.content.initializer === 'batch-signing-confirm') {
      this.handleDialogClose()
      // Send Batch Signing Request
      await this.handleBatchSigning()
    }
  }

  private handleModalClose(): void {
    dialogStore.setMaskActive(false)
    this.modalState = false
  }

  get dialogState() {
    return dialogStore.active
  }

  get dialogContent() {
    return dialogStore.content
  }

  public async handleDialogClose() {
    dialogStore.setActive(false)
    dialogStore.setMaskActive(false)
    if (dialogStore.content.initializer === 'batch-signing-success') {
      try {
        this.$nuxt.$loading.start()
        await this.sendGetSigningRequest()
      } catch (e) {
        dialogStore.setActive(true)
        dialogStore.setMaskActive(true)
        dialogStore.setContent({
          title: e.message,
          icon: true,
          type: 'accept'
        })
      } finally {
        this.$nuxt.$loading.finish()
      }
    }
  }

  private tableFields: Array<TableField> = [
    { label: '時間', field: 'time' },
    { label: '申請項目', field: 'application' },
    { label: '帳號', field: 'applierId' },
    { label: '申請人', field: 'applier' },
    { label: '狀態', field: 'status' }
  ]

  get authorized(): boolean {
    return welfareStore.authorized
  }

  private form: any = {
    signingStatus: '',
    opinion: ''
  }

  private selected: Array<any> = []

  private handleSelectionChanged({ selectedRows }: any) {
    const map = selectedRows.map((row: any) => row.id)
    this.selected = [...map]
  }

  public async handleCellClick(params: any) {
    // params.row - row object
    // params.column - column object
    // params.rowIndex - index of this row on the current page.
    // params.event - click event
    try {
      this.$nuxt.$loading.start()
      await welfareStore.getLatest({
        token: this.$cookies.get('accessToken'),
        serialno: params.row.id
      })
      await welfareStore.getSheets({ token: this.$cookies.get('accessToken') })

      let sheetId: number | null = null
      welfareStore.sheets.forEach((category) => {
        const findSheet = category.sheets.find(
          (sheet: any) => sheet.sheetName === params.row.application
        )
        if (findSheet) {
          sheetId = findSheet.id
        }
      })
      this.$nuxt.$loading.finish()
      if (sheetId !== null) {
        this.$router.push({
          name: 'welfare-form-serialno-formserialno',
          params: {
            serialno: sheetId,
            formserialno: welfareStore.formNew.id,
            from: 'welfare-authorize',
            status: params.row.status
          }
        })
      } else {
        // error
      }
    } catch (e) {
      // error
    }
  }

  public async handlePageUpdate(params: any) {
    // params.currentPage - current page that pagination is at
    // params.prevPage - previous page
    // params.currentPerPage - number of items per page
    // params.total - total number of items in the table
    this.pagination.start = (params.currentPage - 1) * this.pagination.length
    this.$nuxt.$loading.start()
    await this.sendGetSigningRequest()
    this.$nuxt.$loading.finish()
  }

  public async handlePageLengthUpdate(params: any) {
    // params.currentPage - current page that pagination is at
    // params.currentPerPage - number of items per page
    // params.total - total number of items in the table
    params.currentPage = 1

    this.pagination.length = params.currentPerPage
    this.pagination.start = 0
    this.$nuxt.$loading.start()
    await this.sendGetSigningRequest()
    this.$nuxt.$loading.finish()
  }

  public pagination = {
    start: 0,
    length: 10
  }

  public searchParams = {
    ApplicationStartDate: '',
    SearchText: '',
    SearchStatus: -1
  }

  get signingList(): Array<TableData> {
    return Object.keys(welfareStore.signingList).length
      ? welfareStore.signingListData.map((item: any) => ({
          id: item.id,
          time: new Date(item.applicationDateTime).toLocaleString('zh-tw', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric'
          }),
          application: item.sheetName,
          applicationId: item.caseNumber,
          applier: item.applicantChineseName,
          applierId: item.applicantId,
          // verification: item.opinion !== null ? item.opinion : '',
          status: item.strStatus
        }))
      : []
  }

  get signingListDataLength() {
    return welfareStore.signingListDataLength
  }

  public async handleSearch() {
    this.resetPagination()
    await this.sendGetSigningRequest()
  }

  public resetPagination() {
    this.pagination = { ...this.pagination, start: 0 }
  }

  public async sendBatchSigningRequest() {
    const requestBody: ProxyRequestObject = {
      endpoint: '/api/Welfare/ApplicationForm/BatchSigning',
      key: process.env.apiKey,
      data: {
        ids: [...this.selected],
        singingStatus: this.form.signingStatus,
        opinion: this.form.opinion
      },
      method: 'post',
      token: this.$cookies.get('accessToken')
    }
    try {
      const result: ResponseObject = await $axios.post('/api', requestBody)
      switch (Number(result.data.syscode)) {
        case 200:
          return result.data.data
        case 4037:
          throw new Error('清單內有申請單狀態不符，無法簽核')
        default:
          throw new Error('Error rating the store')
      }
    } catch (e) {
      throw new Error(e)
    }
  }

  public async sendGetSigningRequest() {
    try {
      await welfareStore.getSigningList({
        token: this.$cookies.get('accessToken'),
        ...this.pagination,
        ...this.searchParams
      })
    } catch (e) {
      // error
      throw new Error(e)
    }
  }

  public async sendAuthorizeRequest() {
    try {
      await welfareStore.getAuthorized({
        token: this.$cookies.get('accessToken')
      })
    } catch (e) {
      // error
      throw new Error(e)
    }
  }

  public async fetch() {
    try {
      await this.sendAuthorizeRequest()
      await this.sendGetSigningRequest()
    } catch (e) {
      // error
      dialogStore.setActive(true)
      dialogStore.setMaskActive(true)
      dialogStore.setContent({
        title: '資料加載錯誤，請刷新再試。',
        icon: true,
        type: 'accept'
      })
    }
  }

  public activated() {
    this.$nextTick(async () => {
      this.$nuxt.$loading.start()
      try {
        await this.sendGetSigningRequest()
        await this.sendAuthorizeRequest()
      } catch (e) {
        dialogStore.setActive(true)
        dialogStore.setMaskActive(true)
        dialogStore.setContent({
          title: '資料加載錯誤，請刷新再試。',
          icon: true,
          type: 'accept'
        })
      }

      this.$nuxt.$loading.finish()
    })
  }
}
</script>
<style lang="scss" scoped>
@import '../../assets/scss/utils/variables';

.welfareRecord {
  &__btnbox {
    display: flex;
    align-items: flex-end;
    margin-bottom: $spacing-m;
  }
  &__btntext {
    color: $greyThree;
    font-weight: bold;
    font-size: $fz-s;
    margin-left: $spacing-m;
  }
  &__tablerow {
    padding: $spacing-l 0;
    min-width: 100px;
    cursor: pointer;
  }
  &__tableheadingtext {
    color: $greyTwo;
    font-weight: bold;
  }
  &__text {
    font-weight: bold;
  }
  &__subtext {
    color: $greyTwo;
    font-size: $fz-xs;
  }
  &__badge {
    padding: $spacing-xs $spacing-xxl;
    border-radius: 40px;
    background-color: $primary;
    color: #fff;
    font-size: $fz-xs;
    &--primary {
      background-color: $primary;
    }
    &--secondary {
      background-color: $secondary;
    }
    &--greyOne {
      background-color: $greyOne;
    }
    &--greyTwo {
      background-color: $greyTwo;
    }
  }
}

.signingModal {
  &__title {
    font-size: $fz-xxl;
    margin-bottom: $spacing-l;
    text-align: center;
    font-weight: bold;
  }
  &__content {
    margin: $spacing-m 0;
  }
  &__btnbox {
    display: flex;
    margin-top: $spacing-m;
  }
  &__btn {
    flex: 1 0 60%;
    margin-left: $spacing-m;
  }
}
</style>
