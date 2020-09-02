<template>
  <div class="funEventsCalendar">
    <client-only>
      <!-- <calendar-view
        :show-date="showDate"
        class="theme-default holiday-us-traditional holiday-us-official"
      >
        <calendar-view-header
          slot="header"
          slot-scope="t"
          :header-props="t.headerProps"
          @input="setShowDate"
        />
      </calendar-view> -->
    </client-only>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
// import { CalendarView, CalendarViewHeader } from 'vue-simple-calendar'
// require('vue-simple-calendar/static/css/default.css')
// require('vue-simple-calendar/static/css/holidays-us.css')

@Component({
  components: {
    // CalendarView,
    // CalendarViewHeader
  }
})
export default class FunEventsCalendar extends Vue {
  public showDate = new Date()

  setShowDate(d: any) {
    this.showDate = d
  }
}
</script>
<style lang="scss" scoped>
@import '../assets/scss/utils/variables';
</style>
