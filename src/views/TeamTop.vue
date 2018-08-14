<template>
  <div
    class="team-top-container"
  >
    <nav>
      <ul>
        <li>
          <router-link
            to="sprint_backlog"
          >
            <h3>スプリントバックログ</h3>
            <small>今スプリントの計画です</small>
          </router-link>
          <router-link
            to="product_backlog"
          >
            <h3>プロダクトバックログ</h3>
            <small>今後の実装の全ての一覧です</small>
          </router-link>
          <router-link
            to="/"
          >
            <h3>チームメンバー</h3>
            <small>メンバーの招待や管理を行います</small>
          </router-link>
          <router-link
            to="/"
          >
            <h3>設定</h3>
            <small>ワークフローや見積りの単位などを設定します</small>
          </router-link>
        </li>
      </ul>
    </nav>
    <div
      class="main-content"
    >
      <router-view
        :teamId="teamId"
        :currentSprint="currentSprint"
        :productBacklog="productBacklog"
        :config="config"
        :DBTeamRef="DBTeamRef"
      />
    </div>
  </div>
</template>

<script>
import firebase from './../firebase'

const db = firebase.firestore()
const settings = {
  timestampsInSnapshots: true
}
db.settings(settings)

export default {
  data: function () {
    const teamId = this.$route.params['teamId']
    return {
      teamId: teamId,
      productBacklog: [],
      currentSprint: '',
      config: {},
      DBTeamRef: db.collection('ScrumTeams').doc(teamId)
    }
  },
  created: function () {
    // Team Data Document
    this.DBTeamRef.get()
      .then(doc => {
        const data = doc.data()
        this.currentSprint = data.currentSprint
        this.config = data.config
      })
    // Product Backlog
    this.DBTeamRef.collection('ProductBacklog').where('status', '==', 'sprintItem').where('status', '==', 'todo').orderBy('order').get()
      .then(snapShot => {
        snapShot.forEach(doc => {
          this.productBacklog.push(Object.assign(doc.data(), { id: doc.id }))
        })
      })
  }
}
</script>

<style scoped lang="scss">
.team-top-container {
  display: flex;

  nav {
    width: 300px;
    background-color: #222;
    min-height: 100vh;

    ul {
      list-style: none;

      li {
        a {
          color: #fff;
          padding: 0 16px;
          display: block;

          &:hover {
            color: #4cabff;
          }
        }
      }
    }
  }

  .main-content {
    width: calc(100% - 300px);
    padding: 0 16px;
  }
}
</style>
