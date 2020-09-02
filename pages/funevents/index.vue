<template>
  <DefaultMainContainer title="瘋活動">
    <div v-show="!calendarToggle" class="funEventsHeader">
      <h2 class="funEventsHeader__title">
        活動列表
      </h2>
      <button class="funEventsHeader__btn" @click="calendarToggle = true">
        <fa :icon="['fas', 'calendar']" />
        <span>查看活動行事曆</span>
      </button>
    </div>
    <div class="funEventsHeader" v-if="calendarToggle">
      <h2 class="funEventsHeader__title">
        活動行事曆
      </h2>
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
            v-for="event in eventList"
            :key="event.serialno"
            class="px-0 mb-5"
          >
            <div
              class="funEventsBody__cardbox"
              @click="handleRouteUpdate(event.serialno)"
            >
              <FunEventsCard :value="event" />
            </div>
          </b-col>
        </b-row>
      </b-container>
    </div>
    <div class="funEventsBody" v-if="calendarToggle">
      <FunEventsCalendar />
    </div>
  </DefaultMainContainer>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import DefaultMainContainer from '~/components/DefaultMainContainer.vue'
import FunEventsCard from '~/components/FunEventsCard.vue'
import FunEventsCalendar from '~/components/FunEventsCalendar.vue'
import { funEventsStore } from '~/store'

@Component({
  middleware: 'auth',
  components: {
    DefaultMainContainer,
    FunEventsCard,
    FunEventsCalendar
  }
})
export default class FunEventsIndex extends Vue {
  public calendarToggle: boolean = false

  public handleRouteUpdate(serialno: string) {
    this.$router.push({ name: 'funevents-serialno', params: { serialno } })
  }

  get eventList() {
    return Object.keys(funEventsStore.eventList).length
      ? funEventsStore.eventList.list.map((item: any) => ({
          ...item,
          serialno: item.funActivtiySerialNo,
          startDateTime: new Date(item.startDateTime)
            .toLocaleString()
            .split(' ')[0],
          endDateTime: new Date(item.startDateTime)
            .toLocaleString()
            .split(' ')[0]
        }))
      : []
  }

  public async sendGetEventListRequest() {
    try {
      await funEventsStore.getEventList({
        token: this.$cookies.get('accessToken')
      })
    } catch (e) {
      // error
    }
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

  public async fetch() {
    await this.sendGetEventListRequest()
  }

  public activated() {
    this.$nextTick(async () => {
      this.$nuxt.$loading.start()
      await this.sendGetEventListRequest()
      await this.sendGetCalendarRequest(
        new Date().toLocaleString().split(' ')[0],
        'Month'
      )
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
    background-color: #fff;
    font-size: $fz-m;
    padding: $spacing-m 0;
    color: $greyThree;
    > span {
      margin-left: $spacing-xs;
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
