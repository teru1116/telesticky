<template>
  <md-card
    class="board-container"
    ref="sprintBoard"
  >
    <div class="pb-column">
      <div class="board-header">
        プロダクトバックログ<br />アイテム
      </div>
      <draggable
        element="ol"
        v-model="sprintItems"
        @end="onItemDragged"
      >
        <SprintProductBacklogItem
          v-for="item in sprintItems"
          :data="item"
          :estimationUnit="teamRules.estimationUnit"
          :itemStatusList="teamRules.itemStatusList"
          :activeSprintId="activeSprintId"
          :key="item.id"
        />
      </draggable>
    </div>
    <div class="task-column">
      <div class="board-header">
        <div>作業</div>
        <ol class="board-sub-header">
          <li
            v-for="(taskStatus, index) in teamRules.taskStatusList"
            :key="index"
            :style="{ width: taskStatusHeaderWidths[index] + 'px' }"
          >
            {{ taskStatus }}
          </li>
        </ol>
      </div>
      <ol>
        <TaskLane
          v-for="(item, index) in sprintItems"
          :activeSprintId="activeSprintId"
          :item="item"
          :itemIndex="index"
          :itemTasks="sprintTasks[item.id] ? sprintTasks[item.id] : []"
          :taskStatusList="teamRules.taskStatusList"
          :columnWidths="taskStatusHeaderWidths"
          :parentRefs="$refs"
          :key="item.id"
        />
      </ol>
    </div>
  </md-card>
</template>

<script>
import { mapActions } from 'vuex'

// components
import SprintProductBacklogItem from './SprintProductBacklogItem'
import draggable from 'vuedraggable'
import TaskLane from './TaskLane'

export default {
  props: {
    activeSprintId: String,
    sprintItems: Array,
    sprintTasks: Object,
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
      const keys = Object.keys(this.sprintTasks)
      keys.forEach((key, index) => {
        for (let i = 0; i < this.teamRules.taskStatusList.length; i++) {
          if (!results[i]) results.push(252)
          if (!this.sprintTasks[key][i]) continue
          let taskCount = i === 0 ? this.sprintTasks[key][i].length + 1 : this.sprintTasks[key][i].length
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
      // 優先度を上げたか下げたか（orderの数値が下がっていれば優先度が上げられたことになる）
      const isRaised = (newIndex < oldIndex)
      // アイテムの移動に伴って位置が変わる全てのアイテム
      const relatedItems = isRaised ? this.items.slice(newIndex, oldIndex + 1) : this.items.slice(oldIndex, newIndex + 1)
      // order更新処理開始
      this.moveItem({
        'sprintId': this.activeSprintId,
        'movedItem': movedItem,
        'newIndex': newIndex,
        'oldIndex': oldIndex,
        'isRaised': isRaised,
        'relatedItems': relatedItems
      })
    },
    ...mapActions({
      moveItem: 'moveSprintBacklogItem'
    })
  }
}
</script>

<style scoped lang="scss">
.board-container {
  position: absolute;
  display: flex;
  margin: 0;

  .board-header {
    border-bottom: 1px solid rgba(0, 0, 0, 0.12);
    text-align: center;
    display: table-cell;
    vertical-align: middle;
  }

  .pb-column {
    width: 192px;
    border-right: 1px solid rgba(0,0,0,0.12);

    .board-header {
      width: 192px;
      height: 64px;
    }
    ol {
      padding: 16px!important;
    }
  }

  .task-column {
    .board-header {
      > div {
        height: 32px;
        line-height: 32px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.12);
      }
      ol.board-sub-header {
        display: flex;
        height: 32px;
        padding: 0 16px;

        li {
          width: 252px;
          line-height: 31px;
          text-align: center;
          font-size: 13px;
          font-weight: 300;
          border-right: 1px solid rgba(0,0,0,0.12);

          &:last-child {
            border-right: 0;
          }
        }
      }
    }
  }
}
</style>
