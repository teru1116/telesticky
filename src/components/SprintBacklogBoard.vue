<template>
  <div
    id="board-container"
  >
    <div
      id="pb-column"
    >
      <draggable>
        <ProductBacklogItem
          v-for="item in items"
          :data="item"
          :key="item.id"
          type="small"
        />
      </draggable>
    </div>
    <ol>
      <TaskLane
        v-for="item in items"
        :item="item"
        :taskStatusList="teamRules.taskStatusList"
      />
    </ol>
  </div>
</template>

<script>
// components
import ProductBacklogItem from './ProductBacklogItem'
import draggable from 'vuedraggable'
import TaskLane from './TaskLane'

export default {
  props: {
    items: Array,
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
div#board-container {
  display: flex;

  div#pb-column {
    width: 160px;
  }
}
</style>
