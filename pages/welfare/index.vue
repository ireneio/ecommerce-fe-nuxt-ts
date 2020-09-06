<template>
  <div>
    <welfare-container title="表單申請" :isAuthorized="authorized">
      <section v-for="item in sheets" :key="item.categoryId" class="welfareApplication">
        <h4 class="welfareApplication__title">
          <img src="/img/img-smile.svg" alt="stayfun logo" />
          <span>{{ item.categoryName }}</span>
        </h4>
        <section class="welfareApplication__content">
          <b-container>
            <b-row>
              <b-col cols="24" lg="8" v-for="sheet in item.sheets" :key="sheet.id" class="mt-5">
                <welfare-card
                  :serialno="sheet.documentNumber"
                  :title="sheet.sheetName"
                  @click="handleRouteUpdate(sheet.id)"
                />
              </b-col>
            </b-row>
          </b-container>
        </section>
      </section>
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
import WelfareCard from '~/components/WelfareCard.vue'
import { welfareStore, dialogStore } from '~/store'

@Component({
  middleware: 'auth',
  components: {
    WelfareContainer,
    WelfareCard
  }
})
export default class WelfareIndex extends Vue {
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

  public async handleRouteUpdate(id: any) {
    await this.sendGetFormRequest(id)
    this.$router.push({
      name: 'welfare-form-serialno-formserialno',
      params: { serialno: id, formserialno: welfareStore.formNew.id }
    })
  }

  get sheets() {
    return welfareStore.sheets
  }

  get authorized(): boolean {
    return welfareStore.authorized
  }

  public async sendGetSheetsRequest() {
    try {
      await welfareStore.getSheets({ token: this.$cookies.get('accessToken') })
    } catch (e) {
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

  public async sendGetFormRequest(id: any) {
    try {
      await welfareStore.getForm({
        serialno: id,
        token: this.$cookies.get('accessToken')
      })
    } catch (e) {
      // error
    } finally {
    }
  }

  public async fetch() {
    try {
      await this.sendAuthorizeRequest()
      await this.sendGetSheetsRequest()
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
        await this.sendAuthorizeRequest()
        await this.sendGetSheetsRequest()
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

.welfareApplication {
  &__title {
    display: flex;
    align-items: center;
    padding-top: $spacing-l;
    padding-left: $spacing-l;
    > span {
      font-weight: bold;
      font-size: $fz-xxl;
      margin-left: $spacing-s;
      color: $greyThree;
    }
    > img {
      margin-top: 2px;
    }
  }
  &__content {
    padding-bottom: $spacing-xl;
  }
}
</style>
