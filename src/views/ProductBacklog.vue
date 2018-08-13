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
        <dt>アイテム数</dt>
        <dd>{{ borderPosition }}個</dd>
        <dt>見積り値合計</dt>
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

export default {
  props: {
    teamId: String
  },
  data: function () {
    return {
      productBacklog: [],
      estimationUnit: '',
      isInPlanning: false,
      borderPosition: 0,
      isDragging: false,
      dummyBorderX: 0,
      dummyBorderY: 0
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
      return Math.round((this.dummyBorderX + 280 * 0.5) / 280)
    },
    activeRow: function () {
      return Math.round((this.dummyBorderY + 160 * 0.5) / 160)
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

      this.dummyBorderX = e.pageX >= 310 ? e.pageX - 310 : 0
      this.dummyBorderY = e.pageY >= 250 ? e.pageY - 250 : 0
    },
    onTouchUp: function (e) {
      this.$refs.pbl.removeEventListener('mousemove', this.onTouchMove, false)
      this.isDragging = false
    }
  },
  created: function () {
    // ProductBacklog 取得
    db.collection('ScrumTeams').doc(this.teamId).collection('ProductBacklog').get()
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

ol {
  margin: 32px 0 0;
  padding: 0;
  position: relative;

  &.isInPlanning {
    user-select: none;
  }

  #dummy-planning-border {
    position: absolute;
    width: 296px;
    height: 8px;
    background-color: #42b983;
  }
}
</style>
