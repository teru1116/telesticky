<template>
  <div id="app">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <router-view
      :account="account"
    />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import router from './router'
import firebase from './firebase'
import 'reset-css'

export default {
  created () {
    // ログイン状態を見て適切なURLに遷移させる
    firebase.auth().onAuthStateChanged(user => {
      this.setAuthUser(user)
      if (router.currentRoute.matched && router.currentRoute.matched[0].path === '/auth') return
      if (user) {
        // teams取得
        this.getTeams(user.uid)
        // 前回開いていたteamがあれば表示、なければチーム選択ページへ
        const tid = localStorage.getItem('tid')
        if (tid) {
          router.push({name: 'teams', params: {teamId: tid}})
        } else {
          router.push('/teams')
        }
      } else {
        router.push('/auth/sign_up')
      }
    })
  },
  computed: {
    ...mapState([
      'account'
    ])
  },
  methods: {
    ...mapActions([
      'setAuthUser',
      'getTeams'
    ])
  }
}
</script>

<style lang="scss">
// tool bar
.toolbar-content {
  background-color: rgba(255, 255, 255, 0.0);
  display: flex;
  height: 64px;
  margin-top: -64px;
  padding: 0 16px;

  > * {
    z-index: 12;
    margin: auto 0;
  }

  h2 {
    text-align: left;
    color: #fff;
    text-align: left;
  }

  .pbl-header-right {
    flex: 1;

    .md-button {
      color: #444;
      background-color: #fff;
      float: right;
      margin-left: 8px;
    }
  }
}

// main content
.main-content-container {
  height: calc(100vh - 64px);
}

// force potisioning md-date-picker
.md-datepicker-dialog {
  top: 40%!important;

  .md-datepicker-body-content {
    height: 264px!important;
  }
}
</style>
