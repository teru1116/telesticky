<template>
  <li>
    <h3>
      {{ data.title }}
    </h3>
    <div
      class="card-footer"
    >
      <p>{{ data.estimate + estimationUnit}}</p>
      <select
        v-model="status"
      >
        <option
          v-for="(itemStatus, index) in itemStatusList"
          :value="itemStatus"
          :key="index"
        >
          {{ itemStatus }}
        </option>
      </select>
    </div>
  </li>
</template>

<script>
export default {
  props: {
    data: Object,
    estimationUnit: String,
    itemStatusList: Array
  },
  data: function () {
    return {
      status: this.data.status
    }
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
    height: 80px;
    text-align: left;
    margin: 0!important;
    padding: 0;
  }

  .card-footer {
    display: flex;
  }
}
</style>
