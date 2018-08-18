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
    sprintId: String,
    itemId: String
  },
  data: function () {
    return {
      left: 0,
      top: 0
    }
  },
  created: function () {
    let columnNumber = 0
    let rowNumber = 0
    if (this.task.status === 0) {
      if (this.index <= 3) {
        columnNumber = this.index % 2
        rowNumber = Math.floor(this.index / 2)
      } else {
        columnNumber = Math.floor(this.index / 2)
        rowNumber = this.index % 2
      }
      this.left = columnNumber * 124 + columnNumber * 4
      this.top = rowNumber * 64 + rowNumber * 4
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
