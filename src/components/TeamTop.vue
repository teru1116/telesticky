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
              to="/"
            >
              <span>設定</span>
            </router-link>
          </md-list-item>
        </md-list>
      </md-app-drawer>

      <md-app-content>
        <div
          class="container"
        >
          <router-view
            :sprint="sprint"
            :productBacklog="productBacklog"
            :teamRules="teamRules"
            :menuVisible="menuVisible"
          />
        </div>
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
      'teamRules'
    ]),
    currentMenu () {
      let path = this.$route.path.split('/')[3]
      if (path === 'sprint_backlog') return `スプリント ${this.sprint.sprintNumber === 0 ? '' : this.sprint.sprintNumber}`
      if (path === 'product_backlog') return 'プロダクトバックログ'
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
      getTeamRules: 'getTeamRules'
    }),
    toggleMenu () {
      this.menuVisible = !this.menuVisible
    }
  },
  created: function () {
    this.listenItems()
    this.listenSprint()
    this.getTeamRules()
  }
}
</script>

<style scoped lang="scss">
.md-app {
  height: 100vh;

  #toggle-menu-button {
    left: 64px;
  }

  .md-app-drawer {
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
}

.md-app-toolbar {
  height: 64px;
  background-color: #03a9f4!important;
  z-index: 11;
  margin-bottom: 24px;
}

.md-drawer {
  width: 260px;
}

.md-app-content {
  padding: 0;
}
</style>
