<template>
  <div>
    <visit-store-container>
      <visit-store-search-bar
        :values="searchParams"
        @update-search="handleUpdateSearch"
        :categories="categories"
        type="shoppingmall"
      />
      <template #body>
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
                :cardType="item.cardType"
                :originalPrice="item.originalPrice"
                :salePrice="item.salePrice"
                @update-route="handleUpdateRoute(item.storeId, item.serialno)"
              />
            </b-col>
            <b-col cols="24" class="mt-5">
              <div class="d-flex justify-content-center">
                <base-button
                  type="primary"
                  display="inline"
                  @click="handlePageUpdate"
                  v-show="storeData.length < storeDataLength"
                >看更多</base-button>
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

@Component({
  layout: 'default',
  middleware: 'auth',
  components: {
    VisitStoreSearchBar,
    VisitStoreContainer,
    VisitStoreCard,
    BaseButton
  }
})
export default class ShoppingMallIndex extends Vue {
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

  public async handleUpdateSearch(payload: any): Promise<any> {
    visitStore.setSearchParams({ ...payload })
    this.$nuxt.$loading.start()
    await this.sendStoreSearchRequest()
    this.$nuxt.$loading.finish()
  }

  public paging: number = 10

  public handlePageUpdate() {
    this.$nuxt.$loading.start()
    this.paging += 10
    const timeout = setTimeout(() => {
      this.$nuxt.$loading.finish()
      clearTimeout(timeout)
    }, 500)
  }

  public handleUpdateRoute(storeId: string, serialno: string) {
    this.$router.push({
      name: 'shoppingmall-serialno',
      params: { serialno, storeId }
    })
  }

  get storeDataLength() {
    return visitStore.storeHome.length
  }

  get searchParams() {
    return visitStore.searchParams
  }

  get storeData() {
    return visitStore.storeHome.slice(0, this.paging).map((item: any) => {
      return {
        ...item,
        title: item.couponName,
        subtitle: item.description,
        type: item.category,
        serialno: item.ticketId,
        logoUrl: item.imageUrl,
        cardType: 'coupon'
      }
    })
  }

  get categories() {
    return commonStore.categories
  }

  public async sendStoreSearchRequest() {
    try {
      await visitStore.getStoreHome({
        token: this.$cookies.get('accessToken'),
        sectionType: 1
      })
    } catch (e) {
      // error
      throw new Error(e)
    }
  }

  public async sendGetCategoriesRequest() {
    try {
      await commonStore.getCategories({
        token: this.$cookies.get('accessToken')
      })
    } catch (e) {
      // error
      throw new Error(e)
    }
  }

  public async sendGetAreasRequest() {
    try {
      await commonStore.getAreas({
        token: this.$cookies.get('accessToken')
      })
    } catch (e) {
      // error
      throw new Error(e)
    }
  }

  public async fetch() {
    // await Promise.all([
    //   this.sendGetAreasRequest(),
    //   this.sendGetCategoriesRequest()
    // ])
    try {
      await this.sendGetCategoriesRequest()
      await this.sendGetAreasRequest()
      await this.sendStoreSearchRequest()
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

  public activated() {
    this.$nextTick(async () => {
      try {
        this.$nuxt.$loading.start()
        await this.sendGetCategoriesRequest()
        await this.sendGetAreasRequest()
        await this.sendStoreSearchRequest()
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
}
</script>
