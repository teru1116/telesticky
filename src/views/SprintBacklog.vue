<template>
  <div>
    <div
      class="pbl-header"
    >
      <h2>
        スプリントバックログ
      </h2>
      <div
        class="pbl-header-right"
      >
        <button
          class="enabled"
        >
          + スプリントで届けるプロダクトバックログアイテムを選択する
        </button>
      </div>
    </div>
    <div>
      <draggable>
        <ProductBacklogItem
          v-for="item in selectedProductBacklog"
          :data="item"
          :key="item.id"
        />
      </draggable>
    </div>
  </div>
</template>

<script>
import firebase from './../firebase'
// components
import draggable from 'vuedraggable'
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
  components: {
    'ProductBacklogItem': ProductBacklogItem
  },
  data: function () {
    return {
      'selectedProductBacklog': []
    }
  },
  created: function () {
    const teamRef = db.collection('ScrumTeams').doc(this.teamId)
    teamRef.get().then(teamDoc => {
      const sprintId = teamDoc.data().currentSprint
      teamRef.collection('Sprints').doc(sprintId).collection('SelectedProductBacklog').orderBy('order').get().then(snapShot => {
        snapShot.forEach(doc => {
          this.selectedProductBacklog.push(Object.assign(doc.data(), {'id': doc.id}))
        })
      })
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
      margin-top: 18px;
    }
  }
}
</style>
