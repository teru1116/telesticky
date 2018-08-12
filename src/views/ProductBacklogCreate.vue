<template>
  <div>
    <section
      class="dimmer"
    >
    </section>
    <div
      class="modal"
    >
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

<style scoped lang="scss">
.dimmer {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 100;
  margin: 0;
  opacity: 1;
  background-color: rgba(0,0,0,.4);
  -webkit-transition: opacity .2s cubic-bezier(.77,0,.175,1) 1ms;
  transition: opacity .2s cubic-bezier(.77,0,.175,1) 1ms;
  display: block;
}

.modal {
  z-index: 999;
  background-color: #fff;
  opacity: 1;
  -webkit-transform: scale(1);
  -ms-transform: scale(1);
  transform: scale(1);
  -webkit-transition: -webkit-transform .35s cubic-bezier(.77,0,.175,1) .1s,opacity .35s cubic-bezier(.77,0,.175,1) .1s;
  transition: transform .35s cubic-bezier(.77,0,.175,1) .1s,opacity .35s cubic-bezier(.77,0,.175,1) .1s;
  padding: 22px 2.25em 3em;
  display: block;
  position: absolute;
  top: 128px;
  left: 0;
  right: 0;
  width: 600px;
  margin: 0 auto;
}
</style>
