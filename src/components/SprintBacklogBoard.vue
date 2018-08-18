<template>
  <div
    id="board-container"
    ref="sprintBoard"
  >
    <div
      id="pb-column"
    >
      <h4>プロダクトバックログ<br />アイテム</h4>
      <draggable
        element="ol"
        v-model="items"
        @end="onItemDragged"
      >
        <SprintProductBacklogItem
          v-for="item in items"
          :data="item"
          :estimationUnit="teamRules.estimationUnit"
          :itemStatusList="teamRules.itemStatusList"
          :activeSprintId="activeSprintId"
          :key="item.id"
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
          :style="{ width: taskStatusHeaderWidths[index] + 'px' }"
        >
          {{ taskStatus }}
        </li>
      </ol>
      <ol>
        <TaskLane
          v-for="(item, index) in items"
          :activeSprintId="activeSprintId"
          :item="item"
          :itemIndex="index"
          :itemTasks="tasks[item.id] ? tasks[item.id] : []"
          :taskStatusList="teamRules.taskStatusList"
          :columnWidths="taskStatusHeaderWidths"
          :parentRefs="$refs"
          :key="item.id"
        />
      </ol>
    </div>
  </div>
</template>

<script>
// components
import SprintProductBacklogItem from './SprintProductBacklogItem'
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
    'SprintProductBacklogItem': SprintProductBacklogItem,
    'draggable': draggable,
    'TaskLane': TaskLane
  },
  computed: {
    taskStatusHeaderWidths: function () {
      let results = []
      const keys = Object.keys(this.tasks)
      keys.forEach((key, index) => {
        for (let i = 0; i < this.teamRules.taskStatusList.length; i++) {
          if (!results[i]) results.push(252)
          if (!this.tasks[key][i]) continue
          let taskCount = i === 0 ? this.tasks[key][i].length + 1 : this.tasks[key][i].length
          if (taskCount <= 4) continue
          results[i] = Math.ceil(taskCount / 2) * 124 + (Math.ceil(taskCount / 2) - 1) * 4
        }
      })
      return results
    }
  },
  methods: {
    onItemDragged: function (event) {
      if (event.type !== 'end') return
      const newIndex = event.newIndex
      const oldIndex = event.oldIndex
      if (newIndex === oldIndex) return

      // 移動したアイテム
      const movedItem = this.items[newIndex]
      console.log('移動したアイテムを正しく取得できていること', movedItem)
      // 優先度を上げたか下げたか（orderの数値が下がっていれば優先度が上げられたことになる）
      const isRaised = (newIndex < oldIndex)
      console.log('優先度を上げたか？', isRaised)
      // アイテムの移動に伴って位置が変わる全てのアイテム
      const relatedItems = isRaised ? this.items.slice(newIndex, oldIndex + 1) : this.items.slice(oldIndex, newIndex + 1)
      console.log('アイテムの移動に伴って位置が変わる全てのアイテム', relatedItems)
      // order更新処理開始
      // this.move({
      //   'movedItem': movedItem,
      //   'newIndex': newIndex,
      //   'isRaised': isRaised,
      //   'relatedItems': relatedItems
      // })
    }
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
        width: 252px;
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
