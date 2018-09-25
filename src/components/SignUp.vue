<template>
  <div class="signin-container">
    <div class="inner">
      <h1>アカウントを新規作成</h1>
      <ul class="signup-form-items">
        <!-- ユーザー名 -->
        <li>
          <label>ユーザー名</label>
          <input
            v-model="displayName"
            type="text"
          />
          <span
            class="error">
            {{ displayNameError }}
          </span>
        </li>
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
        @click="signUp"
        class="md-raised md-primary primary-button"
      >
        アカウントを作成
      </md-button>
      <!-- ログイン画面へ -->
      <router-link
        :to="'/sign_in'"
        class="switch-sign-in-up"
      >
        すでにアカウントをお持ちの方はこちら
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
import router from '@/router'
import firebase from '@/firebase'
import '@/assets/sass/signup.scss'

const db = firebase.firestore()

export default {
  data () {
    return {
      displayName: '',
      displayNameError: '',
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
    signUp () {
      // ユーザー名バリデーション
      const regex = /^[a-zA-Z0-9_\-.]{3,15}/
      if (!regex.test(this.displayName)) {
        this.displayNameError = '3文字から15文字で半角英数字が使用できます。'
        return
      } else {
        this.displayNameError = ''
      }

      // 会員登録API
      this.isProcessing = true

      firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
        .then(userCredential => {
          // Auth Userをストアのステートにセット
          this.setAuthUser(userCredential.user)
          // FirestoreのUsersコレクションへ追加
          const uid = userCredential.user.uid
          return db.collection('users').doc(uid).set({
            email: userCredential.user.email,
            displayName: this.displayName
          })
        })
        .then(() => {
          // displayNameをAuth Userに登録
          const user = firebase.auth().currentUser
          return user.updateProfile({
            displayName: this.displayName
          })
        })
        .then(() => {
          // チーム一覧画面へ遷移
          router.push({ name: 'teamList' })
        })
        .catch(error => {
          switch (error.code) {
            case 'auth/email-already-in-use':
              this.emailError = 'すでに使われているメールアドレスです。'
              break
            case 'auth/invalid-email':
              this.emailError = 'メールアドレスの形式が無効です。'
              break
            case 'auth/weak-password':
              this.passwordError = '入力されたパスワードが簡単すぎます。'
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
