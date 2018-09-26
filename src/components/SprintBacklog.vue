<template>
  <div>

    <!-- header -->
    <div class="content-header">
      <h2>
        {{ sprint.sprintNumber ? 'スプリント' + sprint.sprintNumber : 'スプリントバックログ' }}
      </h2>
      <div class="header-items">
        <md-button
          @click="showFinishSprintConfirm = true"
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
      :md-active.sync="showFinishSprintConfirm"
      md-title="スプリント終了"
      md-content="現在のスプリントを終了します。よろしいですか？<br />スプリントで選択したプロダクトバックログアイテムは削除されません。"
      md-confirm-text="はい"
      md-cancel-text="キャンセル"
      @md-cancel="showFinishSprintConfirm = false"
      @md-confirm="onFinishSprintConfirm"
    />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
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
      showFinishSprintConfirm: false
    }
  },
  methods: {
    ...mapActions([
      'finishSprint'
    ]),
    // "スプリントを終了する" テスト中...
    onFinishSprintConfirm () {
      this.finishSprint({
        teamId: this.team.id,
        sprintId: this.sprint.id
      })
    }
  },
  components: {
    SprintBacklogBoard
  }
}
</script>
