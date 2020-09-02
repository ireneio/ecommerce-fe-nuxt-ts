<template>
  <div>
    <DefaultHeader :menu="menu" @logout="handleLogout" :user="user" />
    <b-container>
      <b-row>
        <b-col cols="24" class="px-0 position-static">
          <Nuxt keep-alive />
        </b-col>
      </b-row>
    </b-container>
    <DefaultFooter />
    <DefaultMask :active="maskState" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import DefaultHeader from '~/components/DefaultHeader.vue'
import DefaultFooter from '~/components/DefaultFooter.vue'
import DefaultMask from '~/components/DefaultMask.vue'

import { dialogStore, authStore } from '~/store'

@Component({
  components: {
    DefaultHeader,
    DefaultFooter,
    DefaultMask
  }
})
export default class DefaultLayout extends Vue {
  public async handleLogout() {
    try {
      this.$nuxt.$loading.start()
      await authStore.signOut({ token: this.$cookies.get('accessToken') })
    } catch (e) {
      // sign out error
    } finally {
      this.$nuxt.$loading.finish()
      this.$router.push('/account')
    }
  }

  get maskState() {
    return dialogStore.maskActive
  }

  get user() {
    return authStore.user !== null ? authStore.user.accountid : ''
  }

  get menu() {
    return authStore.menu.length
      ? authStore.menu
          .filter(
            (item: any) =>
              item.moduleName &&
              item.moduleName !== '好好買' &&
              item.moduleName !== '我的禮物盒'
          )
          .map((item: any) => item.moduleName)
      : []
  }

  public async fetch() {
    await authStore.getMenu({ token: this.$cookies.get('accessToken') })
  }

  public async created() {
    await authStore.getMenu({ token: this.$cookies.get('accessToken') })
  }
}
</script>
