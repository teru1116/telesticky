<template>
  <div>

    <!-- header -->
    <div class="content-header">
      <h2>
        {{ sprint.sprintNumber ? 'スプリント' + sprint.sprintNumber : 'スプリントバックログ' }}
      </h2>
      <div class="header-items">
        <md-button
          @click="showsConfirmFinishSprint = true"
          :disabled="sprint.id.length === 0"
          class="md-raised"
        >
          スプリントを終了する
        </md-button>
      </div>
    </div>

    <!-- body -->
    <div class="main-content-container">
      <SprintBacklogBoard
        :activeSprintId="sprint.id"
        :sprintItems="sprintItems"
        :sprintTasks="sprintTasks"
        :team="team"
      />
    </div>

    <!-- スプリント終了 確認ダイアログ -->
    <md-dialog-confirm
      :md-active.sync="showsConfirmFinishSprint"
      md-title="スプリント終了"
      md-content="現在のスプリントを終了します。よろしいですか？<br />スプリントで選択したプロダクトバックログアイテムは削除されません。"
      md-confirm-text="はい"
      md-cancel-text="キャンセル"
      @md-cancel="showsConfirmFinishSprint = false"
      @md-confirm="onFinishSprintConfirm"
    />

    <!-- インジケータ -->
    <md-progress-spinner
      v-if="showsIndicator"
      md-mode="indeterminate"
    />

    <!-- トースト -->
    <md-snackbar
      :md-position="'center'"
      :md-duration="4000"
      :md-active.sync="showsSnackbarFinishSprint"
      md-persistent
    >
      <span>{{ !errorMessage.length ? 'スプリントを終了しました。' : errorMessage }}</span>
    </md-snackbar>
  </div>
</template>

<script>
import SprintBacklogBoard from './SprintBacklogBoard'

export default {
  props: {
    sprint: Object,
    sprintItems: Array,
    sprintTasks: Object,
    team: Object
  },
  data () {
    return {
      showsConfirmFinishSprint: false,
      showsIndicator: false,
      showsSnackbarFinishSprint: false,
      errorMessage: ''
    }
  },
  methods: {
    onFinishSprintConfirm () {
      this.showsIndicator = true

      this.$store.dispatch('finishSprint', {
        teamId: this.team.id,
        sprintId: this.sprint.id
      })
        .then(() => {
          this.errorMessage = ''
        })
        .catch(error => {
          console.error('finish sprint: ', error)
          this.errorMessage = 'スプリントを正常に終了できませんでした。'
        })
        .finally(() => {
          this.showsIndicator = false
          this.showsSnackbarFinishSprint = true
        })
    }
  },
  components: {
    SprintBacklogBoard
  }
}
</script>
