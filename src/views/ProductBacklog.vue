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
        data="item"
      >
      </ProductBacklogItem>
    </ol>
    <router-view />
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
      productBacklog: []
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
    db.collection('ScrumTeams').doc(this.teamId).collection('ProductBacklog').get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          let item = Object.assign(doc.data(), {'id': doc.id})
          this.productBacklog.push(item)
        })
      })
  }
}
</script>
