<template>
  <md-toolbar class="md-dense">
  <nav>
    <div class="inner">
      <div class="nav-left-contents">
        <router-link
          :to="{ name: 'teamList' }"
        >
          Scrum
        </router-link>
        <router-link
          v-if="$route.params.teamId"
          :to="{ name: 'sprintBacklog', params: { teamId: team.id } }"
        >
          スプリントバックログ
        </router-link>
        <router-link
          v-if="$route.params.teamId"
          :to="{ name: 'productBacklog', params: { teamId: team.id } }"
        >
          プロダクトバックログ
        </router-link>
        <router-link
          v-if="$route.params.teamId"
          :to="{ name: 'teamSettings', params: { teamId: team.id } }"
        >
          チーム設定
        </router-link>
        <router-link
          v-if="$route.params.teamId"
          :to="{ name: 'members', params: { teamId: team.id } }"
        >
          メンバー
        </router-link>
      </div>
      <div class="nav-right-contents">
        <button
          v-if="account"
          :style="{'background-image': 'url(' + photoURL + ')'}"
          class="account-thumbnail"
          @click="showAccountMenu = !showAccountMenu"
        />
      </div>
      <md-card
        v-if="showAccountMenu"
        class="account-menu"
      >
        <ul>
          <li>
            <router-link
              :to="{ name: 'account' }"
            >
              アカウント設定
            </router-link>
          </li>
          <li>
            <a @click="showConfirmSignout = true">
              ログアウト
            </a>
          </li>
        </ul>
      </md-card>
    </div>
  </nav>

  <!-- ログアウト確認ダイアログ -->
  <md-dialog-confirm
    :md-active.sync="showConfirmSignout"
    md-title="ログアウト確認"
    md-content="ログアウトします。<br />よろしいですか？"
    md-confirm-text="はい"
    md-cancel-text="キャンセル"
    @md-cancel="showConfirmSignout = false"
    @md-confirm="signOut"
  />

  <!-- トースト: ログアウトエラー -->
  <md-snackbar
    :md-position="'center'"
    :md-duration="4000"
    :md-active.sync="showsSnackbar"
    md-persistent
  >
    <span>エラー: ログアウトに失敗しました。</span>
  </md-snackbar>

  </md-toolbar>
</template>

<script>
import firebase from '@/firebase'
import router from '@/router'

export default {
  props: {
    account: Object,
    team: Object
  },
  computed: {
    photoURL () {
      return this.account.photoURL || require('./../assets/images/profile.png')
    }
  },
  data () {
    return {
      showAccountMenu: false,
      showConfirmSignout: false,
      showsSnackbar: false
    }
  },
  methods: {
    async signOut () {
      await firebase.auth().signOut()
        .catch(error => {
          this.showsSnackbar = true
          console.error(error)
          return
        })

      this.$store.dispatch('signOut')
      router.push('/sign_in')
    }
  }
}
</script>

<style lang="scss" scoped>
.md-toolbar {
  z-index: 4;
  padding: 0;
  nav {
    background-color: #7b68ee;
    width: 100%;
    height: 48px;
    .inner {
      width: 1000px;
      margin: 0 auto;
      display: flex;
      height: 100%;
      position: relative; // Account Menuのポジショニング用
      .nav-left-contents {
        flex: 1;
        display: flex;
        a {
          color: #fff;
          line-height: 48px;
          margin-right: 40px;
        }
      }
      .nav-right-contents {
        > * {
          float: right;
        }
        button.account-thumbnail {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          margin: 8px 0;
          background-size: cover;
          cursor: pointer;
        }
      }
      .account-menu {
        position: absolute;
        right: 0;
        top: 52px;
        width: 160px;
        ul {
          li {
            a {
              color: rgba(0, 0, 0, 0.87);
              padding: 8px 12px;
              display: block;
            }
          }
        }
      }
    }
  }
}
</style>
