<template>
  <div>
    <div class="inner">
      <ul>
        <li>
          <md-card class="add-team">
            <router-link
              to="/teams/create"
            >
              <i class="material-icons">add</i>
              <span>チームを追加</span>
            </router-link>
          </md-card>
        </li>
        <li
          v-for="(team, index) in teamList"
          :key="team.id"
          :style="(index + 2) % 3 === 0 ? { marginRight: 0 } : null"
          class="team-cell"
        >
          <md-card>
            <a @click="onTeamSelected(team.id)">
              <div class="team-title">{{ team.name }}</div>
              <div class="team-info">
                <dl>
                  <dt>スプリント</dt>
                  <dd>{{ team.sprintNumber }}</dd>
                  <dt>残アイテム数</dt>
                  <dd>{{ team.restItemCount }}</dd>
                  <dt>残ポイント数</dt>
                  <dd>{{ team.restPointCount }}</dd>
                </dl>
              </div>
            </a>
          </md-card>
        </li>
      </ul>
    </div>

    <!-- チーム作成モーダル -->
    <md-dialog
      :md-active="$route.name === 'teamCreate'"
    >
      <router-view
        :uid="account.uid"
        v-on:createTeamSucceeded="onCreateTeamSucceeded"
      />
    </md-dialog>
    <md-snackbar
      :md-position="'center'"
      :md-duration="4000"
      :md-active.sync="isCorrectlyCreated"
      md-persistent
    >
      <span>新しくチームが作成されました</span>
    </md-snackbar>

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
    account: Object
  },
  computed: {
    ...mapState([
      'teamList'
    ])
  },
  data () {
    return {
      showsIndicator: true,
      showsSnackbar: false,
      snackbarMessage: '',
      isCorrectlyCreated: false
    }
  },
  created () {
    // チーム一覧を読み込み
    this.$store.dispatch('getTeamList', this.account.uid)
      .catch(error => {
        this.showSnackbar('エラー: チームページを開けません。時間を置いて再度お試しください。')
        console.error(error)
      })
      .finally(() => {
        this.showsIndicator = false
      })

    // Local StorageのteamIdを削除
    localStorage.removeItem('tid')
  },
  methods: {
    onTeamSelected (teamId) {
      this.showsIndicator = true

      this.$store.dispatch('getTeam', teamId)
        .then(() => {
          this.$router.push({ name: 'productBacklog', params: { 'teamId': teamId } })
        })
        .catch(error => {
          this.showSnackbar('エラー: チームページを開けません。時間を置いて再度お試しください。')
          console.error(error)
        })
        .finally(() => {
          this.showsIndicator = false
        })
    },
    onCreateTeamSucceeded () {
      this.showSnackbar('新しくチームが追加されました。')
    },
    showSnackbar (message) {
      this.snackbarMessage = message
      this.showsSnackbar = true
    }
  }
}
</script>

<style lang="scss" scoped>
.inner {
  width: 1000px;
  margin: 0 auto;
  ul {
    display: flex;
    flex-wrap: wrap;
    padding: 40px 0 0;
    li {
      width: 300px;
      height: 204px;
      margin: 0 50px 32px 0;
      .md-card {
        height: 100%;
        background-color: #fff;
        &.add-team {
          a {
            align-items: center;
            justify-content: center;
            i {
              margin: 8px;
              font-size: 24px;
            }
          }
        }
        a {
          display: flex;
          flex-direction: column;
          height: 100%;
          div {
            padding: 16px;
            &.team-title {
              height: 160px;
              font-size: 24px;
              color: #111;
              line-height: 1.2;
            }
            &.team-info {
              border-top: 1px solid #d6d6d6;
              color: #333;
              font-weight: 400;
              dl {
                dt {
                  float: left;
                  clear: both;
                  width: 120px;
                  font-weight: 600;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
