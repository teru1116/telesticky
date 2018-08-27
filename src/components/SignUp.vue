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

    <md-button
      @click="submit"
    >
      さっそく使ってみる
    </md-button>

    <md-button
      @click="$router.push('/sign_in')"
    >
      すでにアカウントをお持ちの方はこちら
    </md-button>

  </div>
</template>

<script>
import router from './../router'
import firebase from './../firebase'

const db = firebase.firestore()

export default {
  data: function () {
    return {
      'email': '',
      'password': '',
      // ui state
      'errorMessage': ''
    }
  },
  methods: {
    submit: function () {
      // FIXME: コールバック地獄
      firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
        .then(userCredential => {
          // 会員登録成功時、uidをfirestoreのUsersコレクションへ追加
          const uid = userCredential.user.uid
          db.collection('Users').doc(uid).set({
            email: userCredential.user.email
          })
            // 会員登録完了時、チーム選択ページへ遷移
            .then(() => {
              router.push('/teams')
            })
        })
        .catch(error => {
          this.signupError = error
          switch (error.code) {
            case 'auth/email-already-in-use':
              this.errorMessage = 'すでに使われているメールアドレスです。'
              break
            case 'auth/invalid-email':
              this.errorMessage = 'メールアドレスの形式が無効です。'
              break
            case 'auth/weak-password':
              this.errorMessage = '入力されたパスワードが推測されやすいようにみえます。'
              break
          }
        })
    }
  }
}
</script>
