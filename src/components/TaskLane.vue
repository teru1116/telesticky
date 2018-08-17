<template>
  <ol>
    <li
      v-for="(taskList, index) in statusTaskList"
      :key="index"
      class="task-status-column"
    >
      <ul>
        <li
          v-for="(task, index) in taskList"
          :key="index"
          class="task-card"
        >
          {{ task.title }}
        </li>
        <li
          v-if="index === 0"
          class="task-card task-card-add"
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

export default {
  props: {
    activeSprintId: String,
    item: Object,
    itemTaskList: Array,
    taskStatusList: Array
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
  computed: {
    statusTaskList: function () {
      if (!this.itemTaskList) return []
      let results = []
      this.itemTaskList.forEach(task => {
        if (!results[task.status]) { results[task.status] = [] }
        results[task.status].push(task)
      })
      return results
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
      if (!this.newTask.title) {
        this.inputMode = false
      } else {
        let payload = {}
        payload['sprintId'] = this.activeSprintId
        payload['itemId'] = this.item.id
        payload['newTask'] = this.newTask

        this.inputMode = false
        this.isUpdating = true

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

  li.task-status-column {
    width: 200px;
    height: 86px;
    margin: 0 4px 8px 0;
    background-color: #f5f5f5;

    ul {
      display: flex;

      li.task-card {
        width: 80px;
        height: 40px;
        font-size: 11px;
        font-weight: 300;
        background-color: #fff;

        &.task-card-add {
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
            border: 1px solid #E5E5E9;
            padding: 2px;
          }
        }
      }
    }
  }
}
</style>
