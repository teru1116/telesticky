<template>
  <li>
    <h3>
      {{ data.title }}
    </h3>
    <div
      class="card-footer"
    >
      {{ data.estimate + estimationUnit }}
    </div>
  </li>
</template>

<script>
export default {
  props: {
    data: Object,
    estimationUnit: String
  }
}
</script>

<style scoped lang="scss">
li {
  width: 280px;
  height: 160px;
  border: 1px solid #d6d6d6;
  border-radius: 4px;
  margin: 0 0 16px;
  padding: 4px 4px;
  list-style: none;

  h3 {
    height: 120px;
    text-align: left;
    margin: 0;
    padding: 0;
  }

  .card-footer {
    text-align: left;
  }
}
</style>
