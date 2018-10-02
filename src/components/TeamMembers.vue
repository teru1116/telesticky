<template>
  <div class="inner">
    <!-- header -->
    <div class="content-header">
      <h2>メンバー</h2>
      <div class="header-items">
        <md-button
          @click="$router.push({ name: 'memberInvite' })"
          class="md-raised md-primary primary-button"
        >
          <md-icon>add</md-icon>
          招待する
        </md-button>
      </div>
    </div>

    <!-- table -->
    <div class="members-table">
      <md-table v-model="members" md-card>
        <md-table-row slot="md-table-row" slot-scope="{ item }">
          <md-table-cell
            class="table-cell-thumbnail"
            :style="{ width: '40px' }"
          >
            <div
              :style="item.photoURL ? {'background-image': 'url(' + item.photoURL + ')'} : {'background-image': 'url(' + require('./../assets/images/profile.png') + ')'}"
              class="member_thumbnail"
            />
          </md-table-cell>
          <md-table-cell md-label="ユーザー名">{{ item.displayName }}</md-table-cell>
          <md-table-cell md-label="メールアドレス">{{ item.email }}</md-table-cell>
        </md-table-row>
      </md-table>
    </div>

    <!-- 招待モーダル -->
    <md-dialog
      :md-active="$route.name === 'memberInvite'"
      :md-click-outside-to-close="false"
    >
      <router-view
        :teamId="team.id"
      />
    </md-dialog>

    <!-- インジケータ -->
    <md-progress-spinner
      v-if="showsIndicator"
      md-mode="indeterminate"
    />

    <!-- トースト -->
    <md-snackbar
      :md-position="'center'"
      :md-duration="4000"
      :md-active.sync="showsSnackbar"
      md-persistent
    >
      <span>{{ snackbarMessage }}</span>
    </md-snackbar>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: {
    team: Object
  },
  data () {
    return {
      showsIndicator: true,
      showsSnackbar: false,
      snackbarMessage: ''
    }
  },
  computed: {
    ...mapState([
      'members'
    ])
  },
  methods: {
    showSnackbar (message) {
      this.snackbarMessage = message
      this.showsSnackbar = true
    }
  },
  created () {
    this.showsIndicator = true

    this.$store.dispatch('getMembers', this.$route.params.teamId)
      .catch(error => {
        this.showSnackbar('エラー: メンバー情報の読み込みに失敗しました。')
        console.error(error)
      })
      .finally(() => {
        this.showsIndicator = false
      })
  }
}
</script>

<style lang="scss" scoped>
.members-table {
  margin: 16px 0 0;
  .md-table {
    .md-table-row {
      .md-table-cell {
        &.table-cell-thumbnail {
          padding: 0;
        }
        .member_thumbnail {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-size: cover;
          display: inline-block;
          vertical-align: middle;
        }
      }
    }
  }
}
</style>
