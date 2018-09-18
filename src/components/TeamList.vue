<template>
  <div>
    <!-- content -->
    <div
      class="inner"
    >
      <ul>
        <li>
          <md-card
            class="add-team"
          >
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
        >
          <md-card>
            <a
              @click="onTeamSelected(team.id)"
            >
              <div
                class="team-title"
              >
                {{ team.name }}
              </div>
              <div
                class="team-info"
              >
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

    <!-- create team dialog -->
    <md-dialog
      :md-active="$route.name === 'teamCreate'"
    >
      <router-view
        :uid="account ? account.uid : ''"
        v-on:onCreateTeamFinish="onCreateTeamFinish"
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

    <!-- indicator -->
    <md-progress-spinner
      v-if="loading"
      md-mode="indeterminate"
    />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import router from '@/router'

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
      loading: true,
      showsCreateTeamDialog: false,
      isCorrectlyCreated: false
    }
  },
  created () {
    this.getTeamList(this.account.uid).then(() => {
      this.loading = false
    })
  },
  methods: {
    ...mapActions([
      'getTeamList',
      'getTeam'
    ]),
    onCreateTeamFinish () {
      this.showsCreateTeamDialog = false
      this.isCorrectlyCreated = true
    },
    onTeamSelected (teamId) {
      this.loading = true
      this.getTeam({ teamId: teamId }).then(() => {
        this.loading = false
        router.push({name: 'productBacklog', params: {'teamId': teamId}})
      })
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
