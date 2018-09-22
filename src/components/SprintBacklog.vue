<template>
  <div>

    <!-- header -->
    <div
      class="content-header"
    >
      <h2>
        {{ sprint.sprintNumber ? 'スプリント' + sprint.sprintNumber : 'スプリントバックログ' }}
      </h2>
      <div
        class="header-items"
      >
        <md-button
          @onclick="onFinishSprintButtonClick"
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
  components: {
    'SprintBacklogBoard': SprintBacklogBoard
  },
  methods: {
    onFinishSprintButtonClick: function () {
      // Local Stoageから現在のスプリントIDを削除
      localStorage.removeItem('sid')
    }
  }
}
</script>
