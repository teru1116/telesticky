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
            <a
              @click="showsCreateTeamDialog = true"
            >
              <i class="material-icons">add</i>
              <span>チームを追加</span>
            </a>
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
      :md-active.sync="showsCreateTeamDialog"
      :style="{ maxHeight: 'none' }"
    >
      <DialogContent
        :uid="authUser ? authUser.uid : ''"
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
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import router from './../router'
// components
import DialogContent from './CreateTeamDialogContent'

export default {
  props: {
    authUser: Object
  },
  computed: {
    ...mapState([
      'teamList'
    ])
  },
  data () {
    return {
      'showsCreateTeamDialog': false,
      'isCorrectlyCreated': false
    }
  },
  created () {
    if (this.authUser) {
      this.getTeams(this.authUser.uid)
    }
  },
  methods: {
    ...mapActions([
      'getTeams',
      'getTeam'
    ]),
    onCreateTeamFinish () {
      this.showsCreateTeamDialog = false
      this.isCorrectlyCreated = true
    },
    onTeamSelected (teamId) {
      this.getTeam({
        'teamId': teamId
      })
        .then(() => {
          router.push({name: 'teamTop', params: {'teamId': teamId}})
        })
    }
  },
  components: {
    DialogContent
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
