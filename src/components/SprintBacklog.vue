<template>
  <div>
    <div class="toolbar-content">
      <h2 :style="menuVisible ? { marginLeft: '0' } : { marginLeft: '48px' }">
        {{ 'スプリント' + sprint.sprintNumber }}
      </h2>
      <div class="pbl-header-right">
        <md-button
          @onclick="onFinishSprintButtonClick"
        >
          スプリントを終了する
        </md-button>
      </div>
    </div>
    <div class="main-content-container">
      <SprintBacklogBoard
        :activeSprintId="sprint.id"
        :sprintItems="sprintItems"
        :sprintTasks="sprintTasks"
        :team="team"
        :menuVisible="menuVisible"
      />
    </div>
  </div>
</template>

<script>
import SprintBacklogBoard from './../components/SprintBacklogBoard'

export default {
  props: {
    sprint: Object,
    sprintItems: Array,
    sprintTasks: Object,
    team: Object,
    menuVisible: Boolean
  },
  components: {
    'SprintBacklogBoard': SprintBacklogBoard
  },
  methods: {
    onFinishSprintButtonClick: function () {
      //
    }
  }
}
</script>
