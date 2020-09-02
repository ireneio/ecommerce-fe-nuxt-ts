<template>
  <VisitStoreContainer>
    <VisitStoreSearchBar
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
            <VisitStoreCard
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
              <BaseButton
                type="primary"
                display="inline"
                @click="handlePageUpdate"
                v-show="storeData.length < storeDataLength"
                >看更多</BaseButton
              >
            </div>
          </b-col>
        </b-row>
      </b-container>
    </template>
  </VisitStoreContainer>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import VisitStoreContainer from '~/components/VisitStoreContainer.vue'
import VisitStoreSearchBar from '~/components/VisitStoreSearchBar.vue'
import VisitStoreCard from '~/components/VisitStoreCard.vue'
import BaseButton from '~/components/BaseButton.vue'
import { visitStore, commonStore } from '~/store'

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
  public paging: number = 10

  public handlePageUpdate() {
    this.$nuxt.$loading.start()
    this.paging += 20
    setTimeout(() => {
      this.$nuxt.$loading.finish()
    }, 2000)
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

  public async handleUpdateSearch(payload: any): Promise<any> {
    visitStore.setSearchParams({ ...payload })
    this.$nuxt.$loading.start()
    await this.sendStoreSearchRequest()
    this.$nuxt.$loading.finish()
  }

  public handleUpdateRoute(serialno: string): void {
    this.$router.push({
      name: 'visitstore-serialno',
      params: { serialno }
    })
  }

  get categories() {
    return commonStore.categories
  }

  public async sendStoreSearchRequest() {
    try {
      await visitStore.getStoreHome({
        token: this.$cookies.get('accessToken'),
        sectionType: 0
      })
    } catch (e) {
      // error
    }
  }

  public async sendGetCategoriesRequest() {
    try {
      await commonStore.getCategories({
        token: this.$cookies.get('accessToken')
      })
    } catch (e) {
      // error
    }
  }

  public async sendGetAreasRequest() {
    try {
      await commonStore.getAreas({
        token: this.$cookies.get('accessToken')
      })
    } catch (e) {
      // error
    }
  }

  public async fetch() {
    await this.sendGetCategoriesRequest()
    await this.sendGetAreasRequest()
    await this.sendStoreSearchRequest()
  }

  public activated() {
    this.$nextTick(async () => {
      this.$nuxt.$loading.start()
      await this.sendGetCategoriesRequest()
      await this.sendGetAreasRequest()
      await this.sendStoreSearchRequest()
      this.$nuxt.$loading.finish()
    })
  }
}
</script>
