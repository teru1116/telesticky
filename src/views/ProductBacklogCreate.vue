<template>
  <div>
    <section
      class="dimmer"
      @click="close"
    >
    </section>
    <div
      class="modal"
    >
      <h2>新規プロダクトバックログアイテム作成</h2>
      <h3>タイトル</h3>
      <small>
        プロダクトバックログの一覧画面に表示されるタイトルです。
      </small>
      <textarea
        v-model="title"
        placeholder="タイトルを入力"
      >
      </textarea>
      <h3>見積り</h3>
      <small>
        開発チームは見積りに責任を持ちます。最終的な見積りは、実際に作業をする人が行います。<br />
        並び順が上のアイテムほど明確で詳細であり、見積りも正確になります。<br />
        並び順が下のアイテムほど不正確で詳細ではありません。
      </small>
      <input
        v-model.number="estimate"
        placeholder="例: 2"
        id="create-card-input-estimate"
      >
      <span>
        {{ estimationUnit }}
      </span>
      <h3>並び順</h3>

      <button
        @click="submit"
        :class="{ enabled: title }"
      >
        プロダクトバックログに追加する
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
    estimationUnit: String,
    productBacklogCount: Number
  },
  data: function () {
    return {
      'title': '',
      'estimate': 0,
      'order': this.productBacklogCount + 1
    }
  },
  methods: {
    close: function () {
      router.push(`/teams/${this.teamId}/product_backlog`)
    },
    submit: function () {
      db.collection('ScrumTeams').doc(this.teamId).collection('ProductBacklog').add({
        'title': this.title,
        'estimate': this.estimate,
        'order': this.order
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
  top: 64px;
  left: 0;
  right: 0;
  width: 600px;
  margin: 0 auto;

  h2 {
    padding: 0 0 8px;
    border-bottom: 1px solid #e5e5e5;
  }

  textarea {
    width: 280px;
    height: 120px;
    font-size: 14px;
    outline: 0;
    resize: none;
    border: 1px solid #E5E5E9;
    padding: 8px;
  }

  input {
    font-size: 14px;
    outline: 0;
    border: 1px solid #E5E5E9;

    &#create-card-input-estimate {
      width: 40px;
      padding: 8px;
    }
  }

  button {
    margin: 32px auto 0;
    display: block;
  }
}
</style>
