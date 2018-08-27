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
  data: function () {
    return {
      'email': '',
      'password': '',
      // ui state
      'errorMessage': ''
    }
  },
  methods: {
    signIn: function () {
      firebase.auth().signInWithEmailAndPassword(this.email, this.password)
        .catch(error => {
          console.error(error)
        })
    }
  }
}
</script>
