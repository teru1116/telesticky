<template>
  <div>
    <input
      v-model="email"
      placeholder="メールアドレス"
    >
    <input
      v-model="password"
      type="password"
      placeholder="パスワード"
    >
    <button
      @click="signIn"
    >
      ログイン
    </button>
    <small>
      まだアカウントをお持ちでない方はこちら
    </small>
    <router-link
      to="/sign_up"
    >
      無料ではじめる
    </router-link>
  </div>
</template>

<script>
import router from './../router'
import firebase from './../firebase'

export default {
  data: function () {
    return {
      'email': '',
      'password': ''
    }
  },
  methods: {
    signIn: function () {
      firebase.auth().signInWithEmailAndPassword(this.email, this.password)
        .catch((error) => {
          console.error(error)
        })
    }
  },
  created: function () {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        router.push('/teams')
      }
    })
  }
}
</script>
