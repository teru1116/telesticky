<template>
  <div>
    <input
      v-model="email"
      placeholder="招待メールを受け取ったメールアドレスを入力"
    >
    <p
      v-if="message"
    >
      {{ message }}
    </p>
    <button
      @click="completeSignUp"
    >
      登録を完了する
    </button>
  </div>
</template>

<script>
import router from './../router'
import firebase from '@/firebase'

const db = firebase.firestore()
const settings = {
  timestampsInSnapshots: true
}
db.settings(settings)

export default {
  data: function () {
    return {
      'teamId': '',
      'nickname': '',
      'role': '',
      'email': '',
      'message': ''
    }
  },
  methods: {
    completeSignUp: function () {
      if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
        firebase.auth().signInWithEmailLink(this.email, window.location.href)
          .then(result => {
            // FIXME: db.batch()に書き換え
            db.collection('Users').doc(result.user.uid).set({
              'email': result.user.email
            })
            db.collection('Users').doc(result.user.uid).collection('teams').doc(this.teamId).set({
              'nickname': this.nickname,
              'role': this.role
            })
            db.collection('ScrumTeams').doc(this.teamId).collection('members').doc(result.user.uid).set({
              'nickname': this.nickname,
              'role': this.role
            })
            // TODO: router.push('/teams/:teamId')
          })
          .catch(error => {
            console.error(error)
            if (error.code === 'auth/invalid-email') {
              this.message = '無効なメールアドレスです。招待メールを受け取ったメールアドレスで登録する必要があります。'
            }
          })
      }
    }
  },
  created: function () {
    this.teamId = this.$route.query['t']
    // TODO: localStorage.setItem('tid', '...')
    this.nickname = this.$route.query['n']
    this.role = this.$route.query['r']

    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        router.push(`/teams/${this.teamId}`)
      }
    })
  }
}
</script>
