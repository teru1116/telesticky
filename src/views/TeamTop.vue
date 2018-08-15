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
        :productBacklog="productBacklog.activeItems"
        :isUpdatingPB="productBacklog.isUpdatingPB"
        :teamRules="teamRules"
      />
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  computed: mapState([
    'productBacklog',
    'teamRules'
  ]),
  methods: {
    ...mapActions({
      listenProductBacklog: 'listenProductBacklog',
      getTeamRules: 'getTeamRules'
    })
  },
  created: function () {
    // listen Product Backlog
    this.listenProductBacklog()
    // get Team Rules
    this.getTeamRules()
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
