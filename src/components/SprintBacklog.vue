<template>
  <div
    class="sb-container"
  >
    <div
      class="dummy-toolbar"
    >
      <h2
        :style="menuVisible ? { marginLeft: '0' } : { marginLeft: '48px' }"
      >
        {{ 'スプリント' + sprint.sprintNumber }}
      </h2>
    </div>
    <div
      class="sb-content"
    >
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
.sb-container {
  .dummy-toolbar {
    h2 {
      z-index: 2;
      font-size: 20px;
      text-align: left;
      color: #fff;
    }
  }

  .sb-content {
    padding: 24px 16px;
  }
}
</style>
