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
import router from '@/router'
import firebase from '@/firebase'
const db = firebase.firestore()

export default {
  data () {
    return {
      'teamId': '',
      'nickname': '',
      'role': '',
      'email': '',
      'message': ''
    }
  },

  methods: {
    completeSignUp () {
      if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
        firebase.auth().signInWithEmailLink(this.email, window.location.href)
          .then(result => {
            const batch = db.batch()
            batch.set(db.collection('Users').doc(result.user.uid), {
              'email': result.user.email
            })
            batch.set(db.collection('Users').doc(result.user.uid).collection('teams').doc(this.teamId), {
              'nickname': this.nickname,
              'role': this.role
            })
            batch.set(db.collection('ScrumTeams').doc(this.teamId).collection('members').doc(result.user.uid), {
              'nickname': this.nickname,
              'role': this.role
            })
            batch.commit().then(() => {
              router.push({ name: 'productBacklog', params: { teamId: this.teamId } })
            })
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

  created () {
    this.teamId = this.$route.query['t']
    localStorage.setItem('tid', this.teamId)
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
