<template>
  <div>

    <ul
      class="form-items"
    >
      <li>
        <input
          v-model="email"
          type=email
        />
      </li>
      <li>
        <input
          v-model="password"
          type=password
        />
      </li>
    </ul>

    <span
      v-if="errorMessage"
    >
      {{ errorMessage }}
    </span>

    <md-button
      @click="signIn"
    >
      ログイン
    </md-button>

    <small>まだアカウントをお持ちでない方はこちら</small>
    <md-button
      @click="$router.push('/auth/sign_up')"
    >
      無料ではじめる
    </md-button>

  </div>
</template>

<script>
import { mapActions } from 'vuex'
import firebase from '@/firebase'
import router from './../router'

export default {
  computed: {
    errorMessage: function () {
      switch (this.firebaseErrorCode) {
        case 'auth/invalid-email':
          return 'メールアドレスの形式が無効です。'
        case 'auth/user-disabled':
          return '入力されたメールアドレスのユーザーは無効です。'
        case 'auth/user-not-found':
          return '入力されたメールアドレスのユーザーが見つかりません。'
        case 'auth/wrong-password':
          return 'パスワードが違います。'
        default:
          return ''
      }
    }
  },
  data: function () {
    return {
      'email': '',
      'password': '',
      'firebaseErrorCode': ''
    }
  },
  methods: {
    ...mapActions([
      'setAuthUser'
    ]),
    signIn: function () {
      firebase.auth().signInWithEmailAndPassword(this.email, this.password)
        .then(userCredential => {
          // authUserをstoreにセット
          this.setAuthUser(userCredential.user)
          // 遷移処理
          // クエリパラメータにリダイレクトpathがあればそこへ遷移
          const redirectPath = router.currentRoute.query.redirect
          if (redirectPath) {
            router.push({ path: redirectPath })
          } else {
            const tid = localStorage.getItem('tid')
            // LocalStorageにteamIdが保存されていればチームのページへ遷移
            if (tid) {
              router.push({ name: 'teamPageContainer', params: { teamId: tid } })
            } else {
              router.push('teams')
            }
          }
        })
        .catch(error => {
          this.firebaseErrorCode = error.code
        })
    }
  }
}
</script>

<style lang="scss" scoped>
input {
  width: 240px;
}
</style>
