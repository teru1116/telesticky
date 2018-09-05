<template>
  <div>
    <header>
      <div
        class="inner"
      >
        <h1>
          Scrum
        </h1>
      </div>
    </header>

    <h2>
      さっそくScrumをはじめよう！
      <small>
        スクラムは、経験的プロセス制御の理論（経験主義）を基本にしている。
      </small>
    </h2>

    <div
      class="form-box"
    >
      <ul
        class="signup-form-items"
      >
        <!-- ユーザー名 -->
        <li>
          <input
            v-model="displayName"
            type=text
            placeholder="ユーザー名"
          />
          <span
            class="error">
          {{ displayNameError }}
          </span>
        </li>

        <!-- メールアドレス -->
        <li>
          <input
            v-model="email"
            type=email
            placeholder="メールアドレス"
          />
          <span
            class="error">
          {{ emailError }}
          </span>
        </li>

        <!-- パスワード -->
        <li>
          <input
            v-model="password"
            type=password
            placeholder="パスワード"
          />
          <span
            class="error">
          {{ passwordError }}
          </span>
        </li>
      </ul>
    </div>

    <div
      class="actions"
    >
      <!-- submit -->
      <md-button
        @click="signup"
        class="auth-submit"
      >
        さっそく使ってみる
      </md-button>
      <!-- ログインページへ -->
      <div>
        <router-link
          :to="'/auth/sign_in'"
          class="link-signin"
        >
          すでにアカウントをお持ちの方はこちら
        </router-link>
      </div>
    </div>

  </div>
</template>

<script>
import { mapActions } from 'vuex'
import router from './../router'
import firebase from './../firebase'
const db = firebase.firestore()

export default {
  data: function () {
    return {
      // 入力項目
      'displayName': '',
      'email': '',
      'password': '',
      // エラー
      'displayNameError': '',
      'emailError': '',
      'passwordError': ''
    }
  },
  methods: {
    ...mapActions([
      'setAuthUser'
    ]),
    signup: function () {
      // ユーザー名バリデーション
      const regex = /^[a-zA-Z0-9_\-.]{3,15}/
      if (!regex.test(this.displayName)) {
        this.displayNameError = '3文字から15文字で半角英数字が使用できます。'
        return
      } else {
        this.displayNameError = ''
      }
      // 会員登録API
      firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
        .then(userCredential => {
          // authUserをstoreにセット
          this.setAuthUser(userCredential.user)
          // FirestoreのUsersコレクションへ追加
          const uid = userCredential.user.uid
          return db.collection('users').doc(uid).set({
            email: userCredential.user.email
          })
        })
        .then(() => {
          // チーム一覧画面へ遷移
          router.push('/teams')
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
              break
          }
        })
    }
  }
}
</script>

<style lang="scss" scoped>
header {
  height: 48px;
  .inner {
    width: 1000px;
    margin: 0 auto;
    h1 {
      //
    }
  }
}
h2 {
  font-size: 40px;
  font-weight: 400;
  line-height: 1.7;
  text-align: center;
  small {
    font-size: 16px;
    color: #666;
    display: block;
  }
}
div.form-box {
  width: 600px;
  margin: 0 auto;
  ul.signup-form-items {
    margin: 40px 0 32px;
    li {
      position: relative;
      margin-bottom: 32px;
      text-align: center;
      input {
        padding: 32px 24px;
        font-size: 18px;
        width: 400px;
        border-radius: 4px;
      }
      span.error {
        position: absolute;
        left: 100px;
        bottom: -24px;
        color: #f58210;
      }
    }
  }
}
div.actions {
  width: 600px;
  margin: 64px auto 0;
  text-align: center;
  button.auth-submit {
    margin: 16px 0;
    padding: 0 32px;
    height: 64px;
  }
  a.link-signin {
    text-decoration: underline;
  }
}
</style>
