<template>
  <div class="signin-container">
    <div class="inner">
      <h1>Telestickyにログインする</h1>
      <ul class="signup-form-items">
        <!-- メールアドレス -->
        <li>
          <label>メールアドレス</label>
          <input
            v-model="email"
            type="text"
          />
          <span
            class="error">
            {{ emailError }}
          </span>
        </li>
        <!-- パスワード -->
        <li>
          <label>パスワード</label>
          <input
            v-model="password"
            type="password"
          />
          <span
            class="error">
            {{ passwordError }}
          </span>
        </li>
      </ul>
      <!-- アカウントを作成 -->
      <md-button
        @click="signIn"
        class="md-raised md-primary primary-button"
      >
        ログイン
      </md-button>
      <!-- ログイン画面へ -->
      <router-link
        :to="'/sign_up'"
        class="switch-sign-in-up"
      >
        まだアカウントをお持ちでない方はこちら
      </router-link>
    </div>

    <!-- indicator -->
    <md-progress-spinner
      v-if="isProcessing"
      md-mode="indeterminate"
    />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import firebase from '@/firebase'
import router from './../router'
import '@/assets/styles/signup.scss'

export default {
  data () {
    return {
      email: '',
      emailError: '',
      password: '',
      passwordError: '',
      isProcessing: false
    }
  },
  methods: {
    ...mapActions([
      'setAuthUser'
    ]),
    signIn () {
      this.isProcessing = true

      firebase.auth().signInWithEmailAndPassword(this.email, this.password)
        .then(userCredential => {
          // authUserをstoreにセット
          this.setAuthUser(userCredential.user)
          // クエリパラメータにリダイレクトpathがあればそこへ遷移
          const redirectPath = router.currentRoute.query.redirect
          if (redirectPath) {
            router.push({ path: redirectPath })
          } else {
            router.push({ name: 'container' })
          }
        })
        .catch(error => {
          switch (error.code) {
            case 'auth/invalid-email':
              this.emailError = 'メールアドレスの形式が無効です。'
              break
            case 'auth/user-disabled':
              this.emailError = '入力されたメールアドレスのユーザーは無効です。'
              break
            case 'auth/user-not-found':
              this.emailError = '入力されたメールアドレスのユーザーが見つかりません。'
              break
            case 'auth/wrong-password':
              this.passwordError = 'パスワードが違います。'
              break
            default:
              this.emailError = '入力されたメールアドレスまたはパスワードが無効です。'
              break
          }
        })
        .finally(() => {
          this.isProcessing = false
        })
    }
  }
}
</script>
