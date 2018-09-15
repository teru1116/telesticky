<template>
  <md-card>
    <div class="modal-header">
      <h2>
        スプリントのアイテムを変更する
      </h2>
      <md-button
        class="close-modal"
        @click="$emit('closeModal')"
      >
        <md-icon>clear</md-icon>
      </md-button>
    </div>
    <div
      class="modal-body"
    >
      <p>
        今スプリントで開発するアイテムを選択しましょう。<br />
        開発チームの予想キャパシティや実績をもとに、<br />
        スプリントで何ができるかを予想します。
      </p>
      <dl>
        <dt>選択中のアイテム数</dt>
        <dd>{{ selectedItems.length }} 個</dd>
        <dt>選択中のアイテムの見積り値合計</dt>
        <dd>{{ selectedTotalEstimate + ' ' + team.estimationUnit }}</dd>
      </dl>
      <md-button
        class="md-raised md-primary submit"
        @click="submit"
      >
        現在のスプリントのアイテムを変更する
      </md-button>
    </div>
  </md-card>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  props: {
    team: Object,
    selectedItems: Array
  },
  computed: {
    selectedTotalEstimate: function () {
      let total = 0
      this.selectedItems.forEach(item => {
        total += item.estimate
      })
      return total
    }
  },
  methods: {
    ...mapActions([
      'changeSprintItem'
    ]),
    submit () {
      this.changeSprintItem({
        teamId: this.team.id,
        items: this.selectedItems
      })
        .then(() => {
          this.updating = false
        })
        .catch(error => {
          this.updating = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.modal-header {
  height: 48px;
  margin: 8px 0 0;
  padding: 0 24px;
  h2 {
    float: left;
    line-height: 48px;
    font-size: 20px;
  }
  button.close-modal {
    float: right;
    color: #666;
    min-width: 44px;
    height: 44px;
  }
}
.modal-body {
  padding: 16px 24px;
  dl {
    margin: 8px 0 0;
    dt {
      float: left;
      clear: both;
      width: 224px;
      color: #666;
      font-weight: 600;
      font-size: 14px;
    }
    dt, dd {
      padding: 4px 0;
    }
  }
  .md-button {
    &.submit {
      background-color: #7b68ee!important;
      margin: 40px 0 0;
    }
  }
}
</style>
