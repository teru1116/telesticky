<template>
  <li
    :style="style"
    @mousedown="onMouseDown"
  >
    <md-card>
      {{ task.title }}
    </md-card>
  </li>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  props: {
    task: Object,
    index: Number,
    baseXs: Array,
    teamId: String,
    sprintId: String,
    itemId: String,
    itemIndex: Number,
    parentRefs: Object,
    itemCardWidth: Number,
    taskCardWidth: Number,
    taskCardHeight: Number,
    taskCardMargin: Number,
    laneSidePadding: Number,
    verticalPadding: Number
  },
  data: function () {
    return {
      isDragging: false,
      draggingX: 0,
      draggingY: 0
    }
  },
  computed: {
    style: function () {
      return {
        width: this.taskCardWidth + 'px',
        height: this.taskCardHeight + 'px',
        left: this.isDragging ? this.draggingX + 'px' : this.left + 'px',
        top: this.isDragging ? this.draggingY + 'px' : this.top + 'px',
        zIndex: this.isDragging ? '1000' : null
      }
    },
    left: function () {
      const columnNumber = this.index <= 3 ? this.index % 2 : Math.floor(this.index / 2)
      const baseX = this.baseXs[this.task.status] + this.laneSidePadding
      return baseX + columnNumber * this.taskCardWidth + columnNumber * this.taskCardMargin
    },
    top: function () {
      const rowNumber = this.index <= 3 ? Math.floor(this.index / 2) : this.index % 2
      return this.verticalPadding + rowNumber * 64 + rowNumber * 4
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

      // マウス座標からカードのX座標を算出
      const leftMargin = this.itemCardWidth + this.laneSidePadding * 2 + 16
      this.draggingX = e.pageX - leftMargin

      // マウス座標からカードのX座標を算出
      this.draggingY = e.pageY - (180 + this.itemIndex * 132 + this.itemIndex * 8)

      // FIXME: スクロールが考慮されていないため、ある程度スクロールした状態でmousemoveするとdraggingX/Yが期待と違う値になる
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
      this.moveTask({
        'teamId': this.teamId,
        'itemId': this.itemId,
        'taskId': this.task.id,
        'status': status
      })
    },
    ...mapActions([
      'moveTask'
    ])
  }
}
</script>

<style scoped lang="scss">
li {
  position: absolute;
  font-size: 11px;
  font-weight: 300;
  background-color: #fff;
  cursor: pointer;

  .md-card {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 2px;
  }
}
</style>
