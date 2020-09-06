<template>
  <div class="funEventsCalendar">
    <client-only>
      <calendar-view
        :show-date="showDate"
        :items="items"
        @click-item="$emit('calendar-item-click', $event)"
        class="theme-default holiday-us-traditional holiday-us-official"
      >
        <calendar-view-header
          slot="header"
          slot-scope="t"
          :header-props="t.headerProps"
          @input="setShowDate"
        />
        <!-- <template #item="{ value }">
          <div class="funEventsCalendar__item">
            {{ value.originalItem.title }}
          </div>
        </template> -->
      </calendar-view>
    </client-only>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
require('vue-simple-calendar/static/css/default.css')
require('vue-simple-calendar/static/css/holidays-us.css')

@Component
export default class FunEventsCalendar extends Vue {
  @Prop({
    type: Array,
    default() {
      return []
    }
  })
  readonly items!: Array<any>

  public showDate = new Date()

  setShowDate(d: any) {
    this.showDate = d
  }
}
</script>
<style lang="scss" scoped>
@import '../assets/scss/utils/variables';
.funEventsCalendar {
  height: 800px;
}

.cv-wrapper {
  background-color: #fff;
}
</style>
