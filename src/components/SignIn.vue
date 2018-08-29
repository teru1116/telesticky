<template>
  <div>

    <md-field>
      <label>メールアドレス</label>
      <md-input
        v-model="email"
      />
    </md-field>

    <md-field>
      <label>パスワード</label>
      <md-input
        v-model="password"
        type="password"
      />
    </md-field>

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
      @click="$router.push('/sign_up')"
    >
      無料ではじめる
    </md-button>

  </div>
</template>

<script>
import firebase from './../firebase'

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
    signIn: function () {
      firebase.auth().signInWithEmailAndPassword(this.email, this.password)
        .catch(error => {
          this.firebaseErrorCode = error.code
        })
    }
  }
}
</script>
