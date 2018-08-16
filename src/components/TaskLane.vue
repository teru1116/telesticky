<template>
  <ol>
    <li
      v-for="(taskStatus, index) in taskStatusList"
      :key=index
    />
  </ol>
</template>

<script>
export default {
  props: {
    item: Object,
    taskStatusList: Array
  }
}
</script>

<style scoped lang="scss">
ol {
  display: flex;

  li {
    width: 200px;
    height: 80px;
    background-color: #f5f5f5;
  }
}
</style>
