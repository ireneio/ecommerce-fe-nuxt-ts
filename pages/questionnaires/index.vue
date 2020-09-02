<template>
  <DefaultMainContainer title="調查所" dark>
    <span class="questionnairesheading">截止日期</span>
    <QuestionnairesCard
      v-for="item in questionnairesListReformatted"
      :key="item.serialno"
      :value="item"
      class="mb-5"
      hasStatus
      hasPic
      type="questionnaires"
      @click="$router.push(`/questionnaires/${item.serialno}`)"
    />
    <div class="questionnaires__paging">
      <div
        class="questionnaires__page"
        @click="handlePageUpdate(-1)"
        v-show="page > 1"
      >
        上一頁
      </div>
      <div
        class="questionnaires__page"
        v-for="i in questionnairesListPagination"
        v-show="i === page || i === page - 1 || i === page + 1"
        :key="i"
        @click="handlePageUpdate(i)"
      >
        <span>{{ i }}</span>
        <span>.</span>
      </div>
      <div
        class="questionnaires__page"
        @click="handlePageUpdate(1)"
        v-show="page < questionnairesListPages"
      >
        下一頁
      </div>
    </div>
  </DefaultMainContainer>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import DefaultMainContainer from '~/components/DefaultMainContainer.vue'
import QuestionnairesCard from '~/components/QuestionnairesCard.vue'
import { questionnairesStore } from '~/store'

@Component({
  middleware: 'auth',
  components: {
    DefaultMainContainer,
    QuestionnairesCard
  }
})
export default class QuestionnairesIndex extends Vue {
  public page: number = 1

  public handlePageUpdate(val: number): void {
    this.$nuxt.$loading.start()
    if (
      (this.page === 1 && val === -1) ||
      (val === 1 && this.page >= this.questionnairesListPages)
    ) {
      return
    } else if (val > 1 && val <= this.questionnairesListPages) {
      this.page = val
    } else {
      this.page += val
    }
    setTimeout(() => {
      this.$nuxt.$loading.finish()
    }, 1000)
  }

  get questionnairesList() {
    return questionnairesStore.questionnairesList
  }

  get questionnairesListReformatted() {
    return this.questionnairesList
      .map((item: any) => ({
        ...item,
        status: item.IsRead ? 0 : 2,
        date: item.EndDate.toString().includes('9999')
          ? null
          : new Date(item.EndDate).toLocaleString(),
        title: item.Title,
        serialno: item.serialno,
        questionStatus: item.IsComplete,
        endDate: item.EndDate.toString().includes('9999')
          ? null
          : new Date(item.EndDate).toLocaleString()
      }))
      .slice((this.page - 1) * 10, (this.page - 1) * 10 + 10 - 1)
  }

  get questionnairesListPages(): number {
    return Math.ceil(this.questionnairesList.length / 10)
  }

  get questionnairesListPagination(): Array<number> {
    let res: Array<number> = []
    for (let i = 1; i <= this.questionnairesListPages; i++) {
      res = [...res, i]
    }
    return res
  }

  public async sendGetQuestionnairesRequest() {
    try {
      await questionnairesStore.getQuestionnairesList({
        token: this.$cookies.get('accessToken')
      })
    } catch (e) {
      // error
    }
  }

  public async fetch() {
    await this.sendGetQuestionnairesRequest()
  }

  public activated() {
    this.$nextTick(async () => {
      this.$nuxt.$loading.start()
      await this.sendGetQuestionnairesRequest()
      this.$nuxt.$loading.finish()
    })
  }
}
</script>
<style lang="scss" scoped>
@import '../../assets/scss/utils/variables';

.questionnairesheading {
  position: absolute;
  right: 15%;
  top: 30px;
}
.questionnaires {
  &__paging {
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
    width: 100%;
  }
  &__page {
    font-size: $fz-m;
    color: $greyThree;
    cursor: pointer;
    padding: $spacing-m;
    font-weight: bold;
  }
}
</style>
