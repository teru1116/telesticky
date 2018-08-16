<template>
  <div>
    <div
      class="pbl-header"
    >
      <h2>
        スプリント {{ activeSprint.sprintNumber === 0 ? '' : activeSprint.sprintNumber }}
      </h2>
    </div>
    <div>
      <draggable>
        <ProductBacklogItem
          v-for="item in activeSprint.items"
          :data="item"
          :key="item.id"
        />
      </draggable>
    </div>
    <ol>
      <TaskLane
        v-for="item in activeSprint.items"
        :item="item"
        :taskStatusList="teamRules.taskStatusList"
      />
    </ol>
  </div>
</template>

<script>
import firebase from './../firebase'
// components
import ProductBacklogItem from './../components/ProductBacklogItem'
import draggable from 'vuedraggable'
import TaskLane from './../components/TaskLane'

const db = firebase.firestore()
const settings = {
  timestampsInSnapshots: true
}
db.settings(settings)

export default {
  props: {
    activeSprint: Object,
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
