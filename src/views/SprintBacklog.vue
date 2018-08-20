<template>
  <div>
    <div
      class="pbl-header"
    >
      <h2>
        スプリント {{ sprint.sprintNumber === 0 ? '' : sprint.sprintNumber }}
      </h2>
    </div>
    <SprintBacklogBoard
      :activeSprintId="sprint.id"
      :sprintItems="sprintItems"
      :tasks="productBacklog.tasks"
      :teamRules="teamRules"
    />
  </div>
</template>

<script>
import SprintBacklogBoard from './../components/SprintBacklogBoard'

export default {
  props: {
    sprint: Object,
    productBacklog: Object,
    teamRules: Object
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
.pbl-header {
  display: flex;
  height: 64px;
  border-bottom: 1px solid #e5e5e5;
  margin-bottom: 24px;

  h2 {
    width: 300px;
    font-size: 24px;
    line-height: 24px;
    margin: 20px 0 0;
    text-align: left;
  }

  .pbl-header-right {
    flex: 1;

    button {
      float: right;
      margin-top: 18px;
    }
  }
}
</style>
