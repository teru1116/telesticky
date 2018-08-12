<template>
  <div>
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
