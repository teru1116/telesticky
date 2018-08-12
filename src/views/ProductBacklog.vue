<template>
  <div>
    <h2>
      プロダクトバックログ
    </h2>
    <button
      @click="showCreateItemView"
    >
      + 新規プロダクトバックログアイテム作成
    </button>
    <ol
      v-for="item in productBacklog"
      :key="item.id"
    >
      <ProductBacklogItem
        :data="item"
        :estimationUnit="estimationUnit"
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
      estimationUnit: ''
    }
  },
  components: {
    'ProductBacklogItem': ProductBacklogItem
  },
  methods: {
    showCreateItemView: function () {
      return router.push(`/teams/${this.teamId}/product_backlog/create`)
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
