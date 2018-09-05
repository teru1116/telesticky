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
import router from './../router'
// components
import GlobalNavHeader from './GlobalNavHeader'

export default {
  props: {
    authUser: Object
  },
  computed: {
    ...mapState([
      'team'
    ])
  },
  watch: {
    team (newTeam) {
      if (newTeam.id) {
        router.push({ name: 'teamPageContainer', params: { teamId: newTeam.id } })
      } else {
        router.push('/teams')
      }
    }
  },
  created () {
    const tid = localStorage.getItem('tid')
    if (tid) {
      router.push({ name: 'teamPageContainer', params: { teamId: tid } })
    } else {
      router.push('/teams')
    }
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
