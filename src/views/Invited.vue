<template>
  <div></div>
</template>

<script>
import router from './../router'
import firebase from './../firebase'

export default {
  data: function () {
    return {
      'teamId': ''
    }
  },
  created: function () {
    this.teamId = this.$route.query['teamId']

    firebase.auth().signInAnonymously().catch(error => {
      console.error(error)
    })

    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        router.push(`/teams/${this.teamId}`)
      }
    })
  }
}
</script>
