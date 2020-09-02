<template>
  <DefaultMainContainer title="返回調查所">
    123
  </DefaultMainContainer>
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import DefaultMainContainer from '~/components/DefaultMainContainer.vue'

@Component({
  components: {
    DefaultMainContainer
  }
})
export default class QuestionnairesResult extends Vue {}
</script>
<style lang="scss" scoped></style>
