<template>
  <div>
    <welfare-container
      title="申請紀錄"
      :isAuthorized="authorized"
      @input="searchParams.SearchText = $event"
      @click="handleSearch"
      @keydown-enter="handleSearch"
    >
      <div class="welfareRecord">
        <client-only>
          <vue-good-table
            :columns="tableFields"
            :rows="appliedList"
            :line-numbers="true"
            :total-rows="appliedListDataLength"
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
            @on-page-change="handlePageUpdate"
            @on-per-page-change="handlePageLengthUpdate"
            @on-row-click="handleRowClick"
          >
            <div slot="emptystate">
              This will show up when there are no rows
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
              <span v-if="props.column.field == 'verification'">
                <div class="welfareRecord__tablerow">
                  <p class="welfareRecord__text">
                    {{ props.row.verification }}
                  </p>
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
        :message="dialogContent.message"
        :title="dialogContent.title"
        :type="dialogContent.type"
        :icon="dialogContent.icon"
      ></default-dialog>
    </client-only>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import WelfareContainer from '~/components/WelfareContainer.vue'
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
    WelfareContainer
  }
})
export default class WelfareRecord extends Vue {
  private head() {
    return {
      title: 'STAYFUN員工福利整合平台 | 申請紀錄',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'STAYFUN員工福利整合平台 | 申請紀錄'
        },
        {
          hid: 'og:title',
          name: 'og:title',
          content: 'STAYFUN員工福利整合平台 | 申請紀錄'
        },
        {
          hid: 'og:type',
          name: 'og:type',
          content: 'STAYFUN員工福利整合平台'
        },
        {
          hid: 'og:description',
          name: 'og:type',
          content: 'STAYFUN員工福利整合平台 | 申請紀錄'
        }
      ]
    }
  }

  get dialogState() {
    return dialogStore.active
  }

  get dialogContent() {
    return dialogStore.content
  }

  public handleDialogClose() {
    dialogStore.setActive(false)
    dialogStore.setMaskActive(false)
  }

  private tableFields: Array<TableField> = [
    { label: '時間', field: 'time' },
    { label: '申請項目', field: 'application' },
    { label: '申請人', field: 'applier' },
    { label: '簽核意見', field: 'verification' },
    { label: '狀態', field: 'status' }
  ]

  get authorized(): boolean {
    return welfareStore.authorized
  }

  public async handleRowClick(params: any) {
    // params.row - row object
    // params.pageIndex - index of this row on the current page.
    // params.selected - if selection is enabled this argument
    // indicates selected or not
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
            formserialno: welfareStore.formNew.id
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
    await this.sendGetAppliedListRequest()
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
    await this.sendGetAppliedListRequest()
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

  get appliedList(): Array<TableData> {
    return Object.keys(welfareStore.appliedList).length
      ? welfareStore.appliedListData.map((item: any) => ({
          id: item.id,
          time: new Date(item.latestUpdateDateTime).toLocaleString('zh-tw', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric'
          }),
          application: item.sheetName,
          applicationId: item.caseNumber,
          applier: item.applicantChineseName,
          verification: item.opinion !== null ? item.opinion : '',
          status: item.strStatus
        }))
      : []
  }

  get appliedListDataLength() {
    return welfareStore.appliedListDataLength
  }

  public async handleSearch() {
    this.resetPagination()
    await this.sendGetAppliedListRequest()
  }

  public resetPagination() {
    this.pagination = { ...this.pagination, start: 0 }
  }

  public async sendGetAppliedListRequest() {
    try {
      await welfareStore.getAppliedList({
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
      throw new Error(e)
    }
  }

  public async fetch() {
    try {
      await this.sendAuthorizeRequest()
      await this.sendGetAppliedListRequest()
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
      try {
        this.$nuxt.$loading.start()
        await this.sendAuthorizeRequest()
        await this.sendGetAppliedListRequest()
      } catch (e) {
        // error
        dialogStore.setActive(true)
        dialogStore.setMaskActive(true)
        dialogStore.setContent({
          title: '資料加載錯誤，請刷新再試。',
          icon: true,
          type: 'accept'
        })
      } finally {
        this.$nuxt.$loading.finish()
      }
    })
  }
}
</script>
<style lang="scss" scoped>
@import '../../assets/scss/utils/variables';

.welfareRecord {
  &__tablerow {
    padding: $spacing-l 0;
    min-width: 100px;
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
</style>
