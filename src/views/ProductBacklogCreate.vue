<template>
  <div>
    <input
      v-model="title"
      placeholder="タイトルを入力"
    >
    <input
      v-model="estimate"
      placeholder="見積りを入力"
    >
    <span>
      {{ estimationUnit }}
    </span>
    <button
      @click="submit"
    >
      この内容でプロダクトバックログアイテムを追加する
    </button>
  </div>
</template>

<script>
import router from './../router'
import firebase from './../firebase'

const db = firebase.firestore()
const settings = {
  timestampsInSnapshots: true
}
db.settings(settings)

export default {
  props: {
    teamId: String,
    estimationUnit: String
  },
  data: function () {
    return {
      'title': '',
      'estimate': 0
    }
  },
  methods: {
    submit: function () {
      db.collection('ScrumTeams').doc(this.teamId).collection('ProductBacklog').add({
        'title': this.title,
        'estimate': this.estimate
      })
        .then(docRef => {
          router.push(`/teams/${this.teamId}/product_backlog`)
        })
    }
  }
}
</script>
