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
        <dd>{{ selectedItemTotalEstimate + estimationUnit }}</dd>
      </dl>
    </div>
    <ol
      ref="pbl"
      :style="isDragging ? {userSelect: 'none'} : ''"
    >
      <ProductBacklogItem
        v-for="item in productBacklog"
        :data="item"
        :estimationUnit="estimationUnit"
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
    </ol>
    <router-view
      :teamId="teamId"
      :estimationUnit="estimationUnit"
      :productBacklogCount="productBacklog.length"
    />
  </div>
</template>

<script>
import router from './../router'
import firebase from './../firebase'
// components
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
    teamId: String
  },
  data: function () {
    return {
      productBacklog: [],
      estimationUnit: '',
      isInPlanning: false,
      isDragging: false,
      dummyBorderX: 0,
      dummyBorderY: 170
    }
  },
  components: {
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
      this.isDragging = true
    },
    onTouchMove: function (e) {
      this.$refs.pbl.addEventListener('mouseup', this.onTouchUp, false)
      // Dummyボーダーの位置をDragに追従させる
      this.dummyBorderX = e.pageX >= 310 ? e.pageX - 310 : 0
      this.dummyBorderY = e.pageY >= 250 ? e.pageY - 250 : 0
    },
    onTouchUp: function (e) {
      this.$refs.pbl.removeEventListener('mousemove', this.onTouchMove, false)
      this.isDragging = false
      // Dummyボーダーの位置補正
      this.dummyBorderX = (this.activeColumn - 1) * 290 + (this.activeColumn - 1) * columnMargin
      this.dummyBorderY = this.activeRow * 170 + (this.activeRow - 1) * rowMargin
    }
  },
  created: function () {
    // ProductBacklog 取得
    db.collection('ScrumTeams').doc(this.teamId).collection('ProductBacklog').orderBy('order').get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          let item = Object.assign(doc.data(), {'id': doc.id})
          this.productBacklog.push(item)
        })
      })

    // 設定取得
    db.collection('ScrumTeams').doc(this.teamId).get()
      .then(doc => {
        this.estimationUnit = doc.data().config.estimationUnit
      })
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
