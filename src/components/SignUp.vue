<template>
  <div>
    <header>
      <h1>
        Scrum
      </h1>
    </header>

    <h2>
      さっそくScrumをはじめよう！
    </h2>
    <p>
      スクラムは、経験的プロセス制御の理論（経験主義）を基本にしている。<br />
      経験主義とは、実際の経験と既知に基づく判断によって知識が獲得できるというものである。<br />
      スクラムでは、反復的かつ漸進的な手法を用いて、予測可能性の最適化とリスクの管理を行う。
    </p>

    <ul
      class="form-items"
    >
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

    <md-button
      @click="signup"
    >
      さっそく使ってみる
    </md-button>

    <md-button
      @click="$router.push('/auth/sign_in')"
    >
      すでにアカウントをお持ちの方はこちら
    </md-button>

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
        this.displayNameError = 'ユーザー名は3文字から15文字で、半角英数字、ハイフン、ドット、アンダースコアが使用できます。'
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
              return
            case 'auth/invalid-email':
              this.emailError =  'メールアドレスの形式が無効です。'
              return
            case 'auth/weak-password':
              this.passwordError = '入力されたパスワードが簡単すぎます。'
            default:
              return
          }
        })
    }
  }
}
</script>
