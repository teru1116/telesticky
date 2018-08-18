<template>
  <li
    :style="isDragging ? { left: draggingX + 'px', top: draggingY + 'px', zIndex: '1000' } : { left: left + 'px', top: top + 'px' }"
    @mousedown="onMouseDown"
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
    itemId: String,
    parentRefs: Object
  },
  data: function () {
    return {
      isDragging: false,
      draggingX: 0,
      draggingY: 0
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
  },
  methods: {
    onMouseDown: function () {
      this.draggingX = this.left
      this.draggingY = this.top
      this.isDragging = true
      this.parentRefs.sprintBoard.addEventListener('mousemove', this.onTouchMove, false)
    },
    onTouchMove: function (e) {
      this.parentRefs.sprintBoard.addEventListener('mouseup', this.onTouchUp, false)
      console.log(e.pageX, e.pageY)
      this.draggingX = e.pageX - 550
      this.draggingY = e.pageY - 180
    },
    onTouchUp: function (e) {
      this.parentRefs.sprintBoard.removeEventListener('mousemove', this.onTouchMove, false)
      // TODO: draggingX, draggingYの数値から異動先のstatusを判定し、action実行
      this.isDragging = false
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
