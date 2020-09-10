<template>
  <div>info</div>
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component({
  middleware: 'auth',
  layout: 'default'
})
export default class MemberIndex extends Vue {}
</script>
