<template>
  <div
    id="board-container"
  >
    <div
      id="pb-column"
    >
      <h4>プロダクトバックログ<br />アイテム</h4>
      <draggable>
        <ProductBacklogItem
          v-for="item in items"
          :data="item"
          :key="item.id"
          type="small"
        />
      </draggable>
    </div>
    <div
      id="task-column"
    >
      <h4>作業</h4>
      <ol
        id="task-column-header"
      >
        <li
          v-for="(taskStatus, index) in teamRules.taskStatusList"
          :key="index"
        >
          {{ taskStatus }}
        </li>
      </ol>
      <ol>
        <TaskLane
          v-for="item in items"
          :activeSprintId="activeSprintId"
          :item="item"
          :itemTaskList="tasks[item.id]"
          :taskStatusList="teamRules.taskStatusList"
          :key="item.id"
        />
      </ol>
    </div>
  </div>
</template>

<script>
// components
import ProductBacklogItem from './ProductBacklogItem'
import draggable from 'vuedraggable'
import TaskLane from './TaskLane'

export default {
  props: {
    activeSprintId: String,
    items: Array,
    tasks: Object,
    teamRules: Object
  },
  components: {
    'ProductBacklogItem': ProductBacklogItem,
    'draggable': draggable,
    'TaskLane': TaskLane
  }
}
</script>

<style scoped lang="scss">
h4 {
  text-align: center;
  background-color: #f5f5f5;
  font-size: 13px;
  line-height: 24px;
  font-weight: 300;
  margin: 0;
  padding: 0;
}

div#board-container {
  display: flex;

  div#pb-column {
    width: 166px;
    margin-right: 16px;
    h4 {
      height: 52px;
      margin-bottom: 8px;
    }
  }

  div#task-column {
    h4 {
      width: calc(100% - 4px);
      height: 24px;
      margin-bottom: 4px;
    }
    ol#task-column-header {
      display: flex;
      li {
        width: 200px;
        height: 24px;
        margin: 0 4px 8px 0;
        text-align: center;
        background-color: #f5f5f5;
        font-size: 13px;
        line-height: 24px;
        font-weight: 300;
      }
    }
  }
}
</style>
