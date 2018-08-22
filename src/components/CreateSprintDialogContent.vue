<template>
  <div>
    <md-toolbar>
      <h2>新規スプリント（スプリント {{ sprintNumber }}）</h2>
    </md-toolbar>
    <md-dialog-content>
      <div
        class="dialog-content-inner"
      >
        <md-datepicker v-model="startDate" md-immediately />
        <md-datepicker v-model="endDate" md-immediately />
        <md-field>
          <label>スプリントゴール</label>
          <md-textarea
            v-model="sprintGoal"
            md-autogrow
          />
        </md-field>
      </div>
      <md-dialog-actions>
        <md-button
          @click="submit"
          class="md-raised md-primary"
          :disabled="!endDate || !startDate"
        >
          新しいスプリントを開始する
        </md-button>
      </md-dialog-actions>
    </md-dialog-content>
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
      createAndStartSprint: 'createAndStartSprint'
    }),
    submit: function () {
      this.createAndStartSprint(
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
.md-toolbar {
  background-color: #03a9f4!important;
  padding: 0 24px;

  h2 {
    font-size: 20px;
    font-weight: 400;
    color: #fff;
  }
}

.md-dialog-container {
  .md-toolbar {
    height: 48px;
  }

  .md-dialog-content {
    max-height: calc(80vh - 48px);
    overflow-y: auto;
    width: 400px;
    padding: 0;

    .dialog-content-inner {
      padding: 16px 24px 72px;
    }

    .md-dialog-actions {
      position: fixed;
      bottom: 0;
      height: 48px;
      width: 100%;
      padding: 0 24px;
      border-top: 1px solid rgba(0,0,0,0.12);
      background-color: #fff;
      z-index: 15;
    }
  }
}
</style>
