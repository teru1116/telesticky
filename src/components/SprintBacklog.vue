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
        :tasks="productBacklog.tasks"
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
    productBacklog: Object,
    teamRules: Object,
    menuVisible: Boolean
  },
  components: {
    'SprintBacklogBoard': SprintBacklogBoard
  },
  computed: {
    sprintItems: function () {
      let results = []
      this.productBacklog.items.forEach(item => {
        if (item.isInCurrentSprint === true) {
          results.push(item)
        }
      })
      return results
    }
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
    padding: 0 16px;
  }
}
</style>
