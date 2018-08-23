<template>
  <div>
    <div class="toolbar-content">
      <h2 :style="menuVisible ? { marginLeft: '0' } : { marginLeft: '48px' }">
        {{ 'スプリント' + sprint.sprintNumber }}
      </h2>
    </div>
    <div class="main-content-container">
      <SprintBacklogBoard
        :activeSprintId="sprint.id"
        :sprintItems="sprintItems"
        :sprintTasks="sprintTasks"
        :teamRules="teamRules"
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
    teamRules: Object,
    menuVisible: Boolean
  },
  components: {
    'SprintBacklogBoard': SprintBacklogBoard
  }
}
</script>

<style scoped lang="scss">
.toolbar-content {
  height: 64px;
  margin-top: -64px;

  h2 {
    z-index: 2;
    font-size: 20px;
    text-align: left;
    color: #fff;
  }
}
</style>
