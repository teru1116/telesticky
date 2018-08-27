<template>
  <div
    class="team-top-container"
  >
    <md-app>
      <md-app-toolbar class="md-primary">
        <md-button
          class="md-icon-button"
          @click="toggleMenu"
          v-if="!menuVisible"
        >
          <md-icon>
            menu
          </md-icon>
        </md-button>
        <span class="md-title"></span>
      </md-app-toolbar>

      <md-app-drawer
        :md-active.sync="menuVisible"
        md-persistent="full"
      >
        <md-toolbar
          class="md-transparent"
          md-elevation="0"
        >
          <span></span>

          <div
            class="md-toolbar-section-end"
          >
            <md-button
              class="md-icon-button md-dense"
              @click="toggleMenu"
            >
              <md-icon>
                keyboard_arrow_left
              </md-icon>
            </md-button>
          </div>
        </md-toolbar>

        <md-list>
          <md-list-item>
            <router-link
              to="sprint_backlog"
            >
              <span>スプリントバックログ</span>
            </router-link>
          </md-list-item>

          <md-list-item>
            <router-link
              to="product_backlog"
            >
              <span>プロダクトバックログ</span>
            </router-link>
          </md-list-item>

          <md-list-item>
            <router-link
              to="/"
            >
              <span>チームメンバー</span>
            </router-link>
          </md-list-item>

          <md-list-item>
            <router-link
              to="team_settings"
            >
              <span>設定</span>
            </router-link>
          </md-list-item>
        </md-list>
      </md-app-drawer>

      <md-app-content>
        <router-view
          :sprint="sprint"
          :productBacklog="productBacklog"
          :sprintItems="productBacklog.items.filter(item => {return item.isSelectedForSprint})"
          :sprintTasks="sprintTasks"
          :team="team"
          :menuVisible="menuVisible"
        />
      </md-app-content>
    </md-app>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  computed: {
    ...mapState([
      'sprint',
      'productBacklog',
      'team'
    ]),
    currentMenu () {
      let path = this.$route.path.split('/')[3]
      if (path === 'sprint_backlog') return `スプリント ${this.sprint.sprintNumber === 0 ? '' : this.sprint.sprintNumber}`
      if (path === 'product_backlog') return 'プロダクトバックログ'
    },
    sprintTasks () {
      let sprintTasks = {}
      let sprintItemIds = []
      this.productBacklog.items.forEach(item => {
        if (item.isSelectedForSprint) {
          sprintItemIds.push(item.id)
        }
      })
      sprintItemIds.forEach(itemId => {
        sprintTasks[itemId] = this.productBacklog.tasks[itemId]
      })
      return sprintTasks
    }
  },
  data: function () {
    return {
      menuVisible: false
    }
  },
  methods: {
    ...mapActions({
      listenItems: 'listenItems',
      listenSprint: 'listenSprint',
      getTeam: 'getTeam'
    }),
    toggleMenu () {
      this.menuVisible = !this.menuVisible
    }
  },
  created: function () {
    this.listenItems()
    this.listenSprint()
    this.getTeam()
  }
}
</script>

<style scoped lang="scss">
.md-app {
  height: 100vh;
  padding: 0;

  .md-app-toolbar {
    height: 64px;
    background-color: #03a9f4!important;
    z-index: 11;
  }

  .md-app-drawer {
    width: 260px;
    background-color: #2d323e!important;
    .md-toolbar {
      .md-icon {
        color: #fff;
      }
    }
    .md-list {
      background-color: #2d323e!important;
      .md-list-item-content a {
        color: #fff;
      }
    }
  }

  .md-app-content {
    padding: 0;
    border: 0;
    height: auto;
  }
}
</style>
