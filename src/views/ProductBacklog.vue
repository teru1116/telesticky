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
        <dd>個</dd>
        <dt>見積り値合計</dt>
        <dd>{{ estimationUnit }}</dd>
      </dl>
    </div>
    <ol>
      <ProductBacklogItem
        v-for="item in productBacklog"
        :data="item"
        :estimationUnit="estimationUnit"
        :key="item.id"
      >
      </ProductBacklogItem>
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
      isInPlanning: false
    }
  },
  components: {
    'ProductBacklogItem': ProductBacklogItem
  },
  methods: {
    showCreateItemView: function () {
      return router.push(`/teams/${this.teamId}/product_backlog/create`)
    },
    startSprintPlanning: function () {
      return this.isInPlanning = !this.isInPlanning
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
}
</style>
