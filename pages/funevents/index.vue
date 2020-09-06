<template>
  <div>
    <default-main-container title="瘋活動">
      <div v-show="!calendarToggle" class="funEventsHeader">
        <h2 class="funEventsHeader__title">活動列表</h2>
        <button class="funEventsHeader__btn" @click="calendarToggle = true">
          <fa :icon="['fas', 'calendar']" />
          <span>查看活動行事曆</span>
        </button>
      </div>
      <div class="funEventsHeader" v-if="calendarToggle">
        <h2 class="funEventsHeader__title">活動行事曆</h2>
        <button class="funEventsHeader__btn" @click="calendarToggle = false">
          <fa :icon="['fas', 'calendar']"></fa>
          <span>回到列表</span>
        </button>
      </div>
      <div v-show="!calendarToggle" class="funEventsBody">
        <b-container>
          <b-row>
            <b-col
              cols="24"
              md="12"
              lg="8"
              xl="6"
              v-for="event in eventListPaged"
              :key="event.serialno"
              class="px-0 mb-5"
            >
              <div class="funEventsBody__cardbox" @click="handleRouteUpdate(event.serialno)">
                <fun-events-card :value="event" />
              </div>
            </b-col>
          </b-row>
          <b-col cols="24" class="mt-5">
            <div class="d-flex justify-content-center">
              <base-button
                type="primary"
                display="inline"
                @click="handlePageUpdate"
                v-show="eventListPaged.length < eventList.length"
              >看更多</base-button>
            </div>
          </b-col>
        </b-container>
      </div>
      <div class="funEventsBody" v-if="calendarToggle">
        <fun-events-calendar :items="calendarItem" @calendar-item-click="handleCalendarItemClick" />
      </div>
    </default-main-container>
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
import { Component, Vue, Watch } from 'nuxt-property-decorator'
import DefaultMainContainer from '~/components/DefaultMainContainer.vue'
import FunEventsCard from '~/components/FunEventsCard.vue'
import FunEventsCalendar from '~/components/FunEventsCalendar.vue'
import { funEventsStore, dialogStore } from '~/store'

@Component({
  middleware: 'auth',
  components: {
    DefaultMainContainer,
    FunEventsCard,
    FunEventsCalendar
  }
})
export default class FunEventsIndex extends Vue {
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

  public handlePageUpdate() {
    this.$nuxt.$loading.start()
    this.paging += 10
    const timeout = setTimeout(() => {
      this.$nuxt.$loading.finish()
      clearTimeout(timeout)
    }, 500)
  }

  public paging: number = 10

  get eventListPaged() {
    return this.eventList.slice(0, this.paging)
  }

  public calendarToggle: boolean = false

  public handleCalendarItemClick({ originalItem: { url } }: any) {
    const serialno = url.split('=')[1]
    this.handleRouteUpdate(serialno)
  }

  public handleRouteUpdate(serialno: string) {
    this.$router.push({ name: 'funevents-serialno', params: { serialno } })
  }

  get eventList() {
    return Object.keys(funEventsStore.eventList).length
      ? funEventsStore.eventList.list.map((item: any) => ({
          ...item,
          serialno: item.funActivtiySerialNo,
          startDateTime: new Date(item.startDateTime).toLocaleString('zh-TW', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          }),
          endDateTime: new Date(item.endDateTime).toLocaleString('zh-TW', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          })
        }))
      : []
  }

  @Watch('calendarToggle')
  public async onCalendarToggle(newVal: boolean) {
    if (newVal) {
      this.$nuxt.$loading.start()
      await this.sendGetCalendarRequest(
        new Date()
          .toLocaleString('zh-tw', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric'
          })
          .split('/')
          .join('-'),
        'Month'
      )
    }
    this.$nuxt.$loading.finish()
  }

  get calendarItem() {
    return funEventsStore.calendar.length
      ? funEventsStore.calendar.map((item: any) => ({
          id: item.serialno,
          startDate: item.activeBeginDate,
          endDate: item.activeEndDate,
          title: item.activeName,
          url: item.url,
          style:
            'background-color:#5ab9d1;color:#fff;padding:8px;cursor:pointer;'
        }))
      : []
  }

  public async sendGetCalendarRequest(date: string, calendarType: string) {
    try {
      await funEventsStore.getCalendar({
        token: this.$cookies.get('accessToken'),
        date,
        calendarType
      })
    } catch (e) {
      // error
    }
  }

  public async sendGetEventListRequest() {
    try {
      await funEventsStore.getEventList({
        token: this.$cookies.get('accessToken')
      })
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

  public async fetch() {
    await this.sendGetEventListRequest()
  }

  public activated() {
    this.$nextTick(async () => {
      this.$nuxt.$loading.start()
      await this.sendGetEventListRequest()
      this.$nuxt.$loading.finish()
    })
  }
}
</script>
<style lang="scss" scoped>
@import '../../assets/scss/utils/variables';
@import '../../assets/scss/utils/media';

.funEventsHeader {
  border-bottom: 1px solid $orange;
  &__title {
    font-size: $fz-m;
    color: $greyThree;
    font-weight: bold;
  }
  &__btn {
    border: none;
    border: 2px solid transparent;
    background-color: #fff;
    font-size: $fz-m;
    padding: $spacing-m 0;
    color: $greyThree;
    > span {
      margin-left: $spacing-xs;
    }
    &:hover {
      color: $primary;
    }
    &:focus {
      color: $primary;
    }
  }
}

.funEventsBody {
  padding: $spacing-xl 0;
  &__cardbox {
    margin: 0 $spacing-m;
  }
}
</style>
