<template>
  <div>
    <GlobalNavHeader
      :authUser="authUser"
      :team="team"
    />
    <main>
      <router-view
        :authUser="authUser"
        :team="team"
      />
    </main>
  </div>
</template>

<script>
import { mapState } from 'vuex'
// components
import GlobalNavHeader from './GlobalNavHeader'

export default {
  props: {
    authUser: Object
  },
  computed: {
    ...mapState([
      'account',
      'team'
    ])
  },
  components: {
    GlobalNavHeader
  }
}
</script>

<style lang="scss" scoped>
main {
  background-color: #f5f5f5;
  min-height: calc(100vh - 48px);
  padding: 16px;
}
</style>
