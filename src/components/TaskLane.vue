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

<style></style>
