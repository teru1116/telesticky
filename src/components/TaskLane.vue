<template>
  <li
    class="tasklane"
    :style="{ height: `${itemCardHeight + verticalPadding * 2}px` }"
  >
    <ol>
      <li
        v-for="(status, statusIndex) in taskStatusList"
        :key="statusIndex"
        :style="{ width: `${columnWidths[statusIndex]}px`, height: `${itemCardHeight + verticalPadding * 2}px` }"
        class="task-status-column"
      >
        <ul>
          <TaskCard
            v-for="(task, index) in itemTasks[statusIndex]"
            :task="task"
            :index="index"
            :baseXs="baseXs"
            :sprintId="activeSprintId"
            :itemId="item.id"
            :itemIndex="itemIndex"
            :parentRefs="parentRefs"
            :key="index"
            :itemCardWidth="itemCardWidth"
            :taskCardWidth="taskCardWidth"
            :taskCardHeight="taskCardHeight"
            :taskCardMargin="taskCardMargin"
            :laneSidePadding="laneSidePadding"
            :verticalPadding="verticalPadding"
            :menuVisible="menuVisible"
            class="task-card"
          />
          <li
            v-if="statusIndex === 0"
            class="task-card-add"
            :style="{ left: addButtonX + 'px', top: addButtonY + 'px', width: taskCardWidth + 'px', height: taskCardHeight + 'px' }"
          >
            <md-button
              v-if="!inputMode"
              @click="inputNewTask"
              :class="isUpdating ? '' : 'enabled'"
            >
              <md-icon>add</md-icon>
            </md-button>
            <textarea
              v-if="inputMode"
              v-model="newTask.title"
              @blur="onFinishInputTask"
            />
          </li>
        </ul>
      </li>
    </ol>
  </li>
</template>

<script>
import { mapActions } from 'vuex'
import TaskCard from './TaskCard'

export default {
  props: {
    activeSprintId: String,
    item: Object,
    itemIndex: Number,
    itemTasks: Array,
    taskStatusList: Array,
    columnWidths: Array,
    parentRefs: Object,
    itemCardWidth: Number,
    itemCardHeight: Number,
    taskCardWidth: Number,
    taskCardMargin: Number,
    laneSidePadding: Number,
    verticalPadding: Number,
    menuVisible: Boolean
  },
  data: function () {
    return {
      inputMode: false,
      isUpdating: false,
      newTask: {
        title: '',
        status: 0
      }
    }
  },
  components: {
    'TaskCard': TaskCard
  },
  computed: {
    taskCardHeight: function () {
      return (this.itemCardHeight - this.taskCardMargin) / 2
    },
    todoTaskCount: function () {
      return this.itemTasks[0] ? this.itemTasks[0].length : 0
    },
    baseXs: function () {
      let results = []
      let total = 0
      for (let i = 0; i < this.taskStatusList.length; i++) {
        results.push(total)
        total = total + this.columnWidths[i]
      }
      return results
    },
    addButtonX: function () {
      const columnNumber = this.todoTaskCount <= 3 ? this.todoTaskCount % 2 : Math.floor(this.todoTaskCount / 2)
      return this.laneSidePadding + columnNumber * this.taskCardWidth + columnNumber * this.taskCardMargin
    },
    addButtonY: function () {
      const rowNumber = this.todoTaskCount <= 3 ? Math.floor(this.todoTaskCount / 2) : this.todoTaskCount % 2
      return this.verticalPadding + rowNumber * this.taskCardHeight + rowNumber * this.taskCardMargin
    }
  },
  methods: {
    ...mapActions([
      'addTask'
    ]),
    inputNewTask: function () {
      this.inputMode = true
    },
    onFinishInputTask: function (e) {
      this.inputMode = false
      if (this.newTask.title) {
        this.isUpdating = true

        let payload = {}
        payload['teamId'] = this.team.id
        payload['sprintId'] = this.activeSprintId
        payload['newTask'] = this.newTask

        this.addTask(payload)
          .then(() => {
            this.isUpdating = false
            this.newTask = {
              title: '',
              status: 0
            }
          })
      }
    }
  }
}
</script>

<style scoped lang="scss">
li.tasklane {
  ol {
    display: flex;
    position: relative;

    li.task-status-column {
      border-right: 1px solid rgba(0,0,0,0.12);

      &:last-child {
        border: 0;
      }

      ul {
        width: 100%;
        height: 100%;

        li.task-card-add {
          position: absolute;
          background-color: #fff;

          .md-button {
            width: 100%;
            height: 100%;
            margin: 0;
          }

          textarea {
            width: 100%;
            height: 100%;
            margin: 0;
            font-size: 12px;
            outline: 0;
            resize: none;
            border: 1px solid #d6d6d6;
            border-radius: 2px;
          }
        }
      }
    }
  }
}
</style>
