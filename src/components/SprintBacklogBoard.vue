<template>
  <div class="board-scroll-view">
    <div ref="sprintBoard" class="board-scroll-content-view">
      <md-card class="board-container">

        <!-- item column -->
        <div
          class="pb-column"
          :style="{ width: itemCardWidth + laneSidePadding * 2 + 'px' }"
        >
          <div
            class="board-header"
            :style="{ width: itemCardWidth + laneSidePadding * 2 + 'px' }"
          >
            プロダクトバックログ<br />アイテム
          </div>
          <draggable
            element="ol"
            v-model="sprintItems"
            @end="onItemDragged"
            :style="{ padding: `${verticalPadding}px ${laneSidePadding}px` }"
          >
            <SprintProductBacklogItem
              v-for="(item, index) in sprintItems"
              :data="item"
              :estimationUnit="team.estimationUnit"
              :itemStatusList="team.itemStatusList"
              :activeSprintId="activeSprintId"
              :itemCardWidth="itemCardWidth"
              :itemCardHeight="itemCardHeight"
              :verticalPadding="verticalPadding"
              :isLastChild="index + 1 === sprintItems.length"
              :key="item.id"
            />
          </draggable>
        </div>

        <!-- task columns -->
        <div class="task-column">
          <div class="board-header">
            <div>作業</div>
            <ol class="board-sub-header">
              <li
                v-for="(taskStatus, index) in team.taskStatusList"
                :key="index"
                :style="{ width: taskColumnWidths[index] + 'px' }"
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
              :taskStatusList="team.taskStatusList"
              :columnWidths="taskColumnWidths"
              :parentRefs="$refs"
              :itemCardWidth="itemCardWidth"
              :itemCardHeight="itemCardHeight"
              :taskCardWidth="taskCardWidth"
              :taskCardMargin="taskCardMargin"
              :laneSidePadding="laneSidePadding"
              :verticalPadding="verticalPadding"
              :menuVisible="menuVisible"
              :key="item.id"
            />
            <!-- アイテムが3つ以下の場合に出す空のTaskLane -->
            <TaskLane
              v-for="index in (3 - sprintItems.length)"
              :item="null"
              :itemIndex="index"
              :itemTasks="[]"
              :taskStatusList="team.taskStatusList"
              :columnWidths="taskColumnWidths"
              :itemCardWidth="itemCardWidth"
              :itemCardHeight="itemCardHeight"
              :taskCardWidth="taskCardWidth"
              :taskCardMargin="taskCardMargin"
              :laneSidePadding="laneSidePadding"
              :verticalPadding="verticalPadding"
              :key="index"
            />
          </ol>
        </div>
      </md-card>
    </div>
  </div>
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
    team: Object,
    menuVisible: Boolean
  },
  components: {
    'SprintProductBacklogItem': SprintProductBacklogItem,
    'draggable': draggable,
    'TaskLane': TaskLane
  },
  data: function () {
    return {
      itemCardWidth: 160,
      itemCardHeight: 132,
      laneSidePadding: 16,
      verticalPadding: 8,
      taskCardWidth: 120,
      taskCardMargin: 4
    }
  },
  computed: {
    taskColumnWidths: function () {
      let results = []
      const keys = Object.keys(this.sprintTasks)
      keys.forEach((key, index) => {
        for (let i = 0; i < this.team.taskStatusList.length; i++) {
          if (!results[i]) { results.push(this.taskCardWidth * 2 + this.taskCardMargin + this.laneSidePadding * 2) }
          if (!this.sprintTasks[key] || !this.sprintTasks[key][i]) { continue }
          // タスクカードの枚数
          let cardCount = this.sprintTasks[key][i].length
          if (i === 0) { cardCount = cardCount + 1 }
          if (cardCount <= 4) { continue }
          // 幅を算出
          const rowCount = 2
          const columnCount = Math.ceil(cardCount / rowCount)
          let value = this.taskCardWidth * columnCount + this.taskCardMargin * (columnCount - 1) + this.laneSidePadding * 2
          // 最大値を適用
          results[i] = results[i] ? Math.max(results[i], value) : value
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
        'teamId': this.team.id,
        'sprintId': this.team.activeSprintId,
        'movedItem': movedItem,
        'newIndex': newIndex,
        'oldIndex': oldIndex,
        'isRaised': isRaised,
        'relatedItems': relatedItems
      })
    },
    ...mapActions([
      'moveItem'
    ])
  }
}
</script>

<style scoped lang="scss">
.board-scroll-view {
  overflow-x: scroll;
  overflow-y: scroll;

  .board-scroll-content-view {
    display: inline-block;    // 幅が子要素の幅で決まるようinlineを設定
    padding: 16px 2px;

    .md-card.board-container {
      display: inline-flex;   // 幅が子要素の幅で決まるようinlineを設定
      margin: 0;

      .board-header {
        border-bottom: 1px solid rgba(0, 0, 0, 0.12);
        text-align: center;
        display: table-cell;
        vertical-align: middle;
      }

      .pb-column {
        border-right: 1px solid rgba(0,0,0,0.12);
        .board-header {
          height: 64px;
        }
      }

      .task-column {
        .board-header {
          > div {
            height: 31px;
            line-height: 31px;
            border-bottom: 1px solid rgba(0, 0, 0, 0.12);
          }
          ol.board-sub-header {
            display: flex;
            height: 32px;

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
  }
}
</style>
