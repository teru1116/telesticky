<template>
  <div>
    <GlobalNavHeader
      :authUser="account.authUser"
      :team="team"
    />
    <main>
      <router-view
        :authUser="account.authUser"
        :team="team"
      />
    </main>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import firebase from '@/firebase'
// components
import GlobalNavHeader from './GlobalNavHeader'

export default {
  computed: {
    ...mapState([
      'account',
      'team'
    ])
  },
  methods: {
    ...mapActions([
      'setAuthUser'
    ])
  },
  created () {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setAuthUser(user)
      }
    })
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
