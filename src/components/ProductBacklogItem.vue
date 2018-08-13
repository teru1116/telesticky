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
    <div
      v-if="isInPlanning && borderPosition == data.order"
      class="planning-border"
    >
    </div>
  </li>
</template>

<script>
export default {
  props: {
    data: Object,
    estimationUnit: String,
    isInPlanning: Boolean,
    borderPosition: Number
  }
}
</script>

<style scoped lang="scss">
li {
  width: 280px;
  height: 160px;
  border: 1px solid #d6d6d6;
  border-radius: 4px;
  margin: 0 16px 16px 0;
  padding: 4px 4px;
  list-style: none;
  position: relative;

  h3 {
    height: 120px;
    text-align: left;
    margin: 0;
    padding: 0;
  }

  .card-footer {
    text-align: left;
  }

  .planning-border {
    position: absolute;
    bottom: -8px;
    left: -8px;
    width: 296px;
    height: 2px;
    background-color: #0088ff;
  }
}
</style>
