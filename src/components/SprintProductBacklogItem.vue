<template>
  <li>
    <h3>
      {{ data.title + ' / ' + data.order }}
    </h3>
    <div
      class="card-footer"
    >
      <p>{{ data.estimate + ' ' + estimationUnit}}</p>
      <select
        v-model="status"
        @change="onStatusChanged"
      >
        <option
          v-for="(statusName, status) in itemStatusList"
          :value="status"
          :key="status"
        >
          {{ statusName }}
        </option>
      </select>
    </div>
  </li>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  props: {
    data: Object,
    estimationUnit: String,
    itemStatusList: Array,
    activeSprintId: String
  },
  data: function () {
    return {
      status: this.data.status
    }
  },
  methods: {
    onStatusChanged: function () {
      this.changeStatus({
        'sprintId': this.activeSprintId,
        'itemId': this.data.id,
        'status': this.status
      })
    },
    ...mapActions({
      changeStatus: 'changeStatusProductBacklogItem'
    })
  }
}
</script>

<style scoped lang="scss">
li {
  width: 160px;
  height: 126px;
  margin: 0 0 8px;
  padding: 2px 2px;
  border: 1px solid #d6d6d6;
  border-radius: 4px;
  list-style: none;
  position: relative;

  h3 {
    font-size: 12px!important;
    height: 100px;
    text-align: left;
    margin: 0!important;
    padding: 0;
  }

  .card-footer {
    display: flex;
    height: 26px;

    p {
      width: 40px;
      line-height: 24px;
      font-weight: 400!important;
      margin: 0;
    }

    select {
      width: 114px;
      height: 24px;
      margin-left: 4px;
      cursor: pointer;
    }
  }
}
</style>
