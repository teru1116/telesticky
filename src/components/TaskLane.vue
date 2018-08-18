<template>
  <li
    class="tasklane"
  >
    <ol>
      <li
        v-for="(status, statusIndex) in taskStatusList"
        :key="statusIndex"
        :style="{ width: columnWidths[statusIndex] + 'px' }"
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
            class="task-card"
          />
          <li
            v-if="statusIndex === 0"
            class="task-card-add"
            :style="{ left: addButtonX + 'px', top: addButtonY + 'px' }"
          >
            <button
              v-if="!inputMode"
              @click="inputNewTask"
              :class="isUpdating ? '' : 'enabled'"
            >
              +
            </button>
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
    parentRefs: Object
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
    todoTaskCount: function () {
      return this.itemTasks.length ? this.itemTasks[0].length : 0
    },
    baseXs: function () {
      let results = []
      let total = 0
      for (let i = 0; i < this.taskStatusList.length; i++) {
        results.push(total)
        total = total + this.columnWidths[i] + 4
      }
      return results
    },
    addButtonX: function () {
      const column = this.todoTaskCount <= 3 ? this.todoTaskCount % 2 : Math.floor(this.todoTaskCount / 2)
      return column * 124 + column * 4
    },
    addButtonY: function () {
      const row = this.todoTaskCount <= 3 ? Math.floor(this.todoTaskCount / 2) : this.todoTaskCount % 2
      return row * 64 + row * 4
    }
  },
  methods: {
    ...mapActions({
      create: 'addTask'
    }),
    inputNewTask: function () {
      this.inputMode = true
    },
    onFinishInputTask: function (e) {
      this.inputMode = false
      if (this.newTask.title) {
        this.isUpdating = true

        let payload = {}
        payload['sprintId'] = this.activeSprintId
        payload['itemId'] = this.item.id
        payload['newTask'] = this.newTask

        this.create(payload).then(() => {
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
  height: 132px;
  margin-bottom: 8px;

  ol {
    display: flex;
    position: relative;

    li.task-status-column {
      width: 252px;
      height: 132px;
      margin-right: 4px;
      background-color: #fff;

      ul {
        display: flex;

        li.task-card-add {
          position: absolute;
          width: 124px;
          height: 64px;
          background-color: #fff;
          border-radius: 4px;

          button {
            width: 100%;
            height: 100%;
          }

          textarea {
            width: 118px;
            height: 58px;
            font-size: 12px;
            outline: 0;
            resize: none;
            border: 1px solid #d6d6d6;
            border-radius: 4px;
            padding: 2px;
          }
        }
      }
    }
  }
}
</style>
