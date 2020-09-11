<template>
  <div>
    <visit-store-container>
      <visit-store-search-bar
        :values="searchParams"
        @update-search="handleUpdateSearch"
        :categories="categories"
      />
      <template v-slot:body>
        <b-container>
          <b-row>
            <b-col
              v-for="item in storeData"
              :key="item.serialno"
              cols="24"
              md="12"
              lg="6"
              class="mt-5"
            >
              <visit-store-card
                :title="item.title"
                :subtitle="item.subtitle"
                :type="item.type"
                :serialno="item.serialno"
                :logoUrl="item.logoUrl"
                @update-route="handleUpdateRoute"
              />
            </b-col>
            <b-col cols="24" class="mt-5">
              <div class="d-flex justify-content-center">
                <!-- <base-button
                  type="primary"
                  display="inline"
                  @click="handlePageUpdate"
                  v-show="storeData.length < storeDataLength"
                  >看更多
                </base-button> -->
                <div
                  class="endInfo"
                  v-show="storeData.length >= storeDataLength"
                >
                  無更多資料
                </div>
              </div>
            </b-col>
          </b-row>
        </b-container>
      </template>
    </visit-store-container>
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
import VisitStoreContainer from '~/components/VisitStoreContainer.vue'
import VisitStoreSearchBar from '~/components/VisitStoreSearchBar.vue'
import VisitStoreCard from '~/components/VisitStoreCard.vue'
import BaseButton from '~/components/BaseButton.vue'
import { visitStore, commonStore, dialogStore } from '~/store'

interface card {
  title: String
  subtitle: String
  serialno: String
  type: String
}

@Component({
  layout: 'default',
  middleware: 'auth',
  components: {
    VisitStoreContainer,
    VisitStoreSearchBar,
    VisitStoreCard,
    BaseButton
  }
})
export default class VisitStoreIndex extends Vue {
  private handleScroll(e: any) {
    if (process.client) {
      const scrollTopPercent =
        (window.scrollY / document.body.clientHeight) * 100
      if (scrollTopPercent >= 5) {
        this.handlePageUpdate()
      }
    }
  }

  get dialogState() {
    return dialogStore.active
  }

  get dialogContent() {
    return dialogStore.content
  }

  private handleDialogClose() {
    dialogStore.setActive(false)
    dialogStore.setMaskActive(false)
  }

  private paging: number = 16

  private handlePageUpdate() {
    // this.$nuxt.$loading.start()
    this.paging += 10
    // const timeout = setTimeout(() => {
    //   this.$nuxt.$loading.finish()
    //   clearTimeout(timeout)
    // }, 500)
  }

  get storeDataLength() {
    return visitStore.storeHome.length
  }

  get storeData() {
    return visitStore.storeHome.slice(0, this.paging).map((item: any) => {
      return {
        ...item,
        title: item.storeName,
        subtitle: item.description,
        type: item.category,
        serialno: item.storeId
      }
    })
  }

  get searchParams() {
    return visitStore.searchParams
  }

  private async handleUpdateSearch(payload: any): Promise<any> {
    visitStore.setSearchParams({ ...payload })
    this.$nuxt.$loading.start()
    await this.sendStoreSearchRequest()
    this.$nuxt.$loading.finish()
  }

  private handleUpdateRoute(serialno: string): void {
    this.$router.push({
      name: 'visitstore-serialno',
      params: { serialno }
    })
  }

  get categories() {
    return commonStore.categories
  }

  private async sendStoreSearchRequest() {
    try {
      await visitStore.getStoreHome({
        token: this.$cookies.get('accessToken'),
        sectionType: 0
      })
    } catch (e) {
      // error
      throw new Error(e)
    }
  }

  private async sendGetCategoriesRequest() {
    try {
      await commonStore.getCategories({
        token: this.$cookies.get('accessToken')
      })
    } catch (e) {
      // error
      throw new Error(e)
    }
  }

  private async sendGetAreasRequest() {
    try {
      await commonStore.getAreas({
        token: this.$cookies.get('accessToken')
      })
    } catch (e) {
      // error
      throw new Error(e)
    }
  }

  private async fetch() {
    try {
      await this.sendGetCategoriesRequest()
      await this.sendGetAreasRequest()
      // 預設不查找
      // await this.sendStoreSearchRequest()
    } catch (e) {
      dialogStore.setActive(true)
      dialogStore.setMaskActive(true)
      dialogStore.setContent({
        title: '資料加載錯誤，請刷新再試。',
        icon: true,
        type: 'accept'
      })
    }
  }

  private activated() {
    this.$nextTick(async () => {
      try {
        this.$nuxt.$loading.start()
        await this.sendGetCategoriesRequest()
        await this.sendGetAreasRequest()
        // 預設不查找
        // await this.sendStoreSearchRequest()
      } catch (e) {
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

  private mounted() {
    window.addEventListener('scroll', this.handleScroll)
  }

  private beforeDestroyed() {
    window.removeEventListener('scroll', this.handleScroll)
  }
}
</script>
<style lang="scss" scoped>
@import '../../assets/scss/utils/variables';

.endInfo {
  font-weight: bold;
  font-size: $fz-m;
  color: $greyTwo;
  text-align: center;
}
</style>
