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
      <h2>スプリント{{ sprintNumber }}</h2>
      <h3>スプリントゴール</h3>
      <small>
        スクラムチームでスプリントゴールを設定しましょう。<br />
        スプリントゴールは、プロダクトバックログを実装することで実現するスプリントの目的で、<br />
        開発チームがインクリメントを開発する指針となるものです。
      </small>
      <textarea
        v-model="sprintGoal"
        placeholder="スプリントゴールを入力"
      >
      </textarea>
      <h3>スプリントの期間</h3>
      <small>
        （一旦固定）
      </small>
      <button
        @click="submit"
        class="enabled"
      >
        スプリントを開始する
      </button>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import router from './../router'

export default {
  props: {
    activeSprint: Object,
    selectedItems: Array
  },
  data: function () {
    return {
      'startDate': new Date(),
      'endDate': new Date(),
      'sprintNumber': this.activeSprint ? this.activeSprint.sprintNumber + 1 : 1,
      'sprintGoal': ''
    }
  },
  methods: {
    ...mapActions({
      createSprintAndStart: 'createSprintAndStart'
    }),
    submit: function () {
      this.createSprintAndStart(
        Object.assign(this.$data, { 'items': this.selectedItems })
      )
        .then(() => {
          router.go(-1)
        })
        .catch(error => {
          console.error(error)
        })
    },
    close: function () {
      router.go(-1)
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
  }

  button {
    margin: 32px auto 0;
    display: block;
  }
}
</style>
