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
      @click="signUp"
    >
      さっそく使ってみる
    </button>
    <router-link
      to="/sign_in"
    >
      すでにアカウントをお持ちの方はこちら
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
    signUp: function () {
      firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
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
