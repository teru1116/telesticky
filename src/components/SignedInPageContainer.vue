<template>
  <div>
    <GlobalNavHeader
      :authUser="account.authUser"
      :team="team"
    />
    <main>
      <div class="main-inner">
        <router-view
          :authUser="account.authUser"
          :team="team"
        />
      </div>
    </main>
  </div>
</template>

<script>
import { mapState } from 'vuex'
// components
import GlobalNavHeader from './GlobalNavHeader'

export default {
  computed: mapState([
    'account',
    'team'
  ]),
  components: {
    GlobalNavHeader
  }
}
</script>

<style lang="scss" scoped>
main {
  background-color: #f5f5f5;
  height: calc(100vh - 48px);
  position: relative;
  overflow: hidden;
  .main-inner {
    padding: 16px;
  }
}
</style>
