<template>
  <li
    :style="isDragging ? { left: draggingX + 'px', top: draggingY + 'px', zIndex: '1000' } : { left: left + 'px', top: top + 'px' }"
    @mousedown="onMouseDown"
  >
    {{ task.title }}
  </li>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  props: {
    task: Object,
    index: Number,
    baseXs: Array,
    sprintId: String,
    itemId: String,
    itemIndex: Number,
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
      return this.baseXs[this.task.status] + columnNumber * 124 + columnNumber * 4
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
      this.draggingX = e.pageX - 550
      this.draggingY = e.pageY - (180 + this.itemIndex * 132 + this.itemIndex * 8)
    },
    onTouchUp: function (e) {
      this.parentRefs.sprintBoard.removeEventListener('mousemove', this.onTouchMove, false)
      this.parentRefs.sprintBoard.removeEventListener('mouseup', this.onTouchUp, false)
      this.isDragging = false

      // draggingXの値から移動先のstatusを判定
      if (this.draggingY < -40 || this.draggingY > 100) return
      let status = 0
      for (let statusIndex = 0; statusIndex < this.baseXs.length; statusIndex++) {
        if (this.draggingX > this.baseXs[statusIndex]) {
          status = statusIndex
        } else {
          break
        }
      }
      if (status === this.task.status) return

      // 更新処理実行
      const payload = {
        'sprintId': this.sprintId,
        'itemId': this.itemId,
        'taskId': this.task.id,
        'task': {
          'title': this.task.title,
          'status': status
        }
      }
      this.update(payload)
    },
    ...mapActions({
      update: 'updateTask'
    })
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
