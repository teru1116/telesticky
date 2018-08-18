<template>
  <li
    :style="{ left: left + 'px', top: top + 'px' }"
  >
    {{ task.title }}
  </li>
</template>

<script>
export default {
  props: {
    task: Object,
    index: Number,
    baseX: Number,
    sprintId: String,
    itemId: String
  },
  data: function () {
    return {
      isDragging: false
    }
  },
  computed: {
    left: function () {
      const columnNumber = this.index <= 3 ? this.index % 2 : Math.floor(this.index / 2)
      return this.baseX + columnNumber * 124 + columnNumber * 4
    },
    top: function () {
      const rowNumber = this.index <= 3 ? Math.floor(this.index / 2) : this.index % 2
      return rowNumber * 64 + rowNumber * 4
    }
  }
}
</script>

<style scoped lang="scss">
li {
  position: absolute;
  width: 118px;
  height: 58px;
  font-size: 11px;
  font-weight: 300;
  background-color: #fff;
  border: 1px solid #d6d6d6;
  padding: 2px;
  border-radius: 4px;
}
</style>
