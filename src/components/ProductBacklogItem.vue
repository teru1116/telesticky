<template>
  <li
    :class="type"
  >
    <h3>
      {{ data.title }}
    </h3>
    <div
      class="card-footer"
    >
      <p>{{ data.estimate + estimationUnit + ' ' + data.order }}</p>
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
    borderPosition: Number,
    type: String
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

  &.small {
    width: 160px;
    height: 126px;
    margin: 0 0 8px;
    padding: 2px 2px;

    h3 {
      font-size: 12px!important;
    }

    .card-footer {
      display: none;
    }
  }
}
</style>
