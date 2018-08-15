<template>
  <div>
    <div
      class="pbl-header"
    >
      <h2>
        プロダクトバックログ
      </h2>
      <div
        class="pbl-header-right"
      >
        <button
          @click="showCreateItemView"
          class="enabled"
        >
          + 新規プロダクトバックログアイテムを作成する
        </button>
        <button
          @click="startSprintPlanning"
          class="enabled"
        >
          {{ isInPlanning ? 'スプリントプランニングを終了する' : 'スプリントプランニングを開始する' }}
        </button>
      </div>
    </div>
    <div
      v-if="isInPlanning"
    >
      <p>
        スプリントで届けるプロダクトバックログアイテムを選択します。<br />
        選択し終えたら、スプリントバックログ画面で、より詳細な計画づくりをします。
      </p>
      <dl>
        <dt>選択中のアイテム数</dt>
        <dd>{{ borderPosition }}個</dd>
        <dt>選択中の見積り値合計</dt>
        <dd>{{ selectedItemTotalEstimate + config.estimationUnit }}</dd>
      </dl>
      <button
        @click="pushItemsIntoSprint"
        class="enabled"
      >
        選択したアイテムをスプリントに投入する
      </button>
    </div>
    <div
      ref="pbl"
    >
      <draggable
        element="ol"
        v-model="productBacklog"
        @end="onItemDragged"
        :options="isUpdating ? {disabled: true} : {disabled: false}"
      >
        <ProductBacklogItem
          v-for="item in productBacklog"
          :data="item"
          :estimationUnit="config.estimationUnit"
          :isInPlanning="isInPlanning"
          :borderPosition="borderPosition"
          :key="item.id"
        />
        <div
          v-if="isInPlanning"
          @mousedown="onBorderSelected"
          ref="dummyPlanningBorder"
          id="dummy-planning-border"
          :style="{ left: `${dummyBorderX}px`, top: `${dummyBorderY}px` }"
        />
      </draggable>
    </div>
    <router-view
      :teamId="teamId"
      :estimationUnit="config.estimationUnit"
    />
  </div>
</template>

<script>
import router from './../router'
import firebase from './../firebase'
// components
import draggable from 'vuedraggable'
import ProductBacklogItem from './../components/ProductBacklogItem'

const db = firebase.firestore()
const settings = {
  timestampsInSnapshots: true
}
db.settings(settings)

const maxRow = 3
const columnMargin = 16
const rowMargin = 16

export default {
  props: {
    teamId: String,
    currentSprint: String,
    productBacklog: Array,
    config: Object,
    DBTeamRef: Object
  },
  data: function () {
    return {
      isInPlanning: false,
      isUpdating: false,
      dummyBorderX: 0,
      dummyBorderY: 170
    }
  },
  components: {
    'draggable': draggable,
    'ProductBacklogItem': ProductBacklogItem
  },
  computed: {
    selectedItemTotalEstimate: function () {
      let index = 0
      let total = 0
      while (index <= this.borderPosition - 1) {
        let item = this.productBacklog[index]
        total = total + item.estimate
        index++
      }
      return total
    },
    activeColumn: function () {
      let rawColumn = 0
      if (this.dummyBorderX < 145) {
        rawColumn = 1
      } else if (this.dummyBorderX >= 145 && this.dummyBorderX < 290 * 1 + 16 * 1 + 145) {
        rawColumn = 2
      } else if (290 * 1 + 16 * 1 + 145 <= this.dummyBorderX && this.dummyBorderX < 290 * 2 + 16 * 2 + 145) {
        rawColumn = 3
      }

      return Math.min(rawColumn, Math.ceil(this.productBacklog.length / maxRow))
    },
    activeRow: function () {
      let rawRow = 0
      if (this.dummyBorderY < 170 + 16 + 80) {
        rawRow = 1
      } else if (170 + 16 + 80 <= this.dummyBorderY && this.dummyBorderY < 170 * 2 + 16 * 2 + 80) {
        rawRow = 2
      } else if (170 * 2 + 16 * 2 + 80 <= this.dummyBorderY && this.dummyBorderY < 170 * 3 + 16 * 3 + 80) {
        rawRow = 3
      }

      // 限界突破判定
      if (this.activeColumn === Math.ceil(this.productBacklog.length / maxRow) && this.productBacklog.length % maxRow !== 0) {
        return Math.min(rawRow, this.productBacklog.length % maxRow)
      }
      return rawRow
    },
    borderPosition: function () {
      return (this.activeColumn - 1) * maxRow + this.activeRow
    }
  },
  methods: {
    showCreateItemView: function () {
      return router.push(`/teams/${this.teamId}/product_backlog/create`)
    },
    startSprintPlanning: function () {
      if (!this.isInPlanning) {
        this.isInPlanning = true
      } else {
        this.isInPlanning = false
      }
    },
    onBorderSelected: function (e) {
      this.$refs.pbl.addEventListener('mousemove', this.onTouchMove, false)
    },
    onTouchMove: function (e) {
      this.$refs.pbl.addEventListener('mouseup', this.onTouchUp, false)
      // Dummyボーダーの位置をDragに追従させる
      this.dummyBorderX = e.pageX >= 310 ? e.pageX - 310 : 0
      this.dummyBorderY = e.pageY >= 250 ? e.pageY - 250 : 0
    },
    onTouchUp: function (e) {
      this.$refs.pbl.removeEventListener('mousemove', this.onTouchMove, false)
      // Dummyボーダーの位置補正
      this.dummyBorderX = (this.activeColumn - 1) * 290 + (this.activeColumn - 1) * columnMargin
      this.dummyBorderY = this.activeRow * 170 + (this.activeRow - 1) * rowMargin
    },
    onItemDragged: function (event) {
      if (event.type !== 'end') return
      if (event.newIndex === event.oldIndex) return
      // 優先度を上げたか下げたか（orderの数値が下がっていれば優先度が上げられたことになる）
      const isRaised = (event.newIndex < event.oldIndex)
      // order更新処理開始
      const batch = db.batch()
      const pblRef = this.DBTeamRef.collection('ProductBacklog')
      this.isUpdating = true
      // orderの数値を下げた場合
      if (isRaised) {
        this.productBacklog.forEach((item, index) => {
          // 動かしたアイテムのorderを更新
          if (item.order === event.oldIndex + 1) {
            batch.update(pblRef.doc(item.id), { order: event.newIndex + 1 })
          // ↑によって影響を受けた全アイテムのorderを更新
          } else if (item.order >= event.newIndex + 1 && item.order < event.oldIndex + 1) {
            batch.update(pblRef.doc(item.id), { order: item.order + 1 })
          }
        })
      // orderの数値を上げた場合
      } else {
        this.productBacklog.forEach((item, index) => {
          // 動かしたアイテムのorderを更新
          if (item.order === event.oldIndex + 1) {
            batch.update(pblRef.doc(item.id), { order: event.newIndex + 1 })
          // ↑によって影響を受けた全アイテムのorderを更新
          } else if (item.order > event.oldIndex + 1 && item.order <= event.newIndex + 1) {
            batch.update(pblRef.doc(item.id), { order: item.order - 1 })
          }
        })
      }
      batch.commit().then(() => {
        this.isUpdating = false
      })
    },
    // 新しいスプリントを開始する
    startNewSprint: function () {
      // Sprint Docのデータ構造
      // id : 1
      // doc {status: 'doing', startDate: Date, endDate: Date, sprintGoal: '', description: '<markdown>'}
      // SubCollection SprintItems / Doc ProductBacklogItem / SubCollection tasks / Doc task {status, title}
    },
    // SprintBacklogに追加
    pushItemsIntoSprint: function () {
      const batch = db.batch()
      const sprintItemsRef = this.DBTeamRef.collection('Sprints').doc(this.sprintId).collection('ProductBacklogItems')
      this.DBTeamRef.collection('ProductBacklog').where('order', '<=', this.borderPosition).orderBy('order').get()
        .then(snapShot => {
          snapShot.forEach(doc => {
            let newSprintItemRef = sprintItemsRef.doc(doc.id)
            batch.set(newSprintItemRef, doc.data())
          })
          batch.commit()
        })
    }
  }
}
</script>

<style scoped lang="scss">
.pbl-header {
  display: flex;
  height: 64px;
  border-bottom: 1px solid #e5e5e5;
  margin-bottom: 24px;

  h2 {
    width: 300px;
    font-size: 24px;
    line-height: 24px;
    margin: 20px 0 0;
    text-align: left;
  }

  .pbl-header-right {
    flex: 1;

    button {
      float: right;
      margin: 18px 0 0 8px;
    }
  }
}

dl {
  dt {
    float: left;
    clear: both;
    width: 180px;
  }
}

ol {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-content: baseline;
  height: 560px;
  margin: 32px 0 0;
  padding: 0;
  position: relative;

  &.isInPlanning {
    user-select: none;
  }

  #dummy-planning-border {
    position: absolute;
    width: 290px;
    height: 16px;
    background-color: rgba(0, 0, 0, 0.0);
  }
}
</style>
