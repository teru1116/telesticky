<template>
  <div>
    <md-toolbar>
      <h2>新規プロダクトバックログアイテム作成</h2>
    </md-toolbar>
    <div
       class="dialog-body"
     >
      <md-field>
        <label>タイトル</label>
        <md-input
          v-model="title"
        />
      </md-field>
      <md-field>
        <label>見積り</label>
        <md-input
          v-model.number="estimate"
        />
      </md-field>
      <md-dialog-actions>
        <md-button
          @click="submit"
          :disabled="title.length >= 1"
        >
          プロダクトバックログに追加する
        </md-button>
      </md-dialog-actions>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  props: {
    estimationUnit: String,
    initialItemStatus: Number
  },
  data: function () {
    return {
      'title': '',
      'estimate': 0
    }
  },
  methods: {
    ...mapActions({
      create: 'addProductBacklogItem'
    }),
    submit: function () {
      this.create({
        'title': this.title,
        'estimate': this.estimate,
        'status': this.initialItemStatus
      })
        .then(() => {
          this.$emit('onCreateItemFinish')
        })
        .catch(error => {
          console.error(error)
        })
    }
  }
}
</script>

<style scoped lang="scss">
.md-toolbar {
  background-color: #03a9f4!important;
  margin-bottom: 24px;

  h2 {
    font-size: 20px;
    font-weight: 400;
    color: #fff;
  }
}

.dialog-body {
  padding: 0 16px;
}
</style>
