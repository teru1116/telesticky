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
  computed: {
    errorMessage: function () {
      switch (this.firebaseErrorCode) {
        case 'auth/email-already-in-use':
          return 'すでに使われているメールアドレスです。'
        case 'auth/invalid-email':
          return 'メールアドレスの形式が無効です。'
        case 'auth/weak-password':
          return '入力されたパスワードが簡単すぎます。'
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
    signup: function () {
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
          this.firebaseErrorCode = error.code
        })
    }
  }
}
</script>
