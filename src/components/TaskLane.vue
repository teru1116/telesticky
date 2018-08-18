<template>
  <ol>
    <li
      v-for="(taskList, index) in itemTasks"
      :key="index"
      :style="{ width: columnWidths[index] + 'px' }"
      class="task-status-column"
    >
      <ul>
        <TaskCard
          v-for="(task, index) in taskList"
          :task="task"
          :index="index"
          :activeSprintId="activeSprintId"
          :itemId="item.id"
          :key="index"
          class="task-card"
        />
        <li
          v-if="index === 0"
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
</template>

<script>
import { mapActions } from 'vuex'
import TaskCard from './TaskCard'

export default {
  props: {
    activeSprintId: String,
    item: Object,
    itemTasks: Array,
    taskStatusList: Array,
    columnWidths: Array
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
      return this.itemTasks[0].length
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
ol {
  display: flex;
  position: relative;

  li.task-status-column {
    width: 252px;
    height: 132px;
    margin: 0 4px 8px 0;
    background-color: #f5f5f5;

    ul {
      display: flex;

      li.task-card-add {
        position: absolute;
        width: 118px;
        height: 58px;
        background-color: #fff;
        border-radius: 4px;

        button {
          width: 100%;
          height: 100%;
        }

        textarea {
          width: 100%;
          height: 100%;
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
</style>
