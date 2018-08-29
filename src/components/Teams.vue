<template>
  <div>
    <!-- 属しているチームがない場合のUI -->
    <div
      v-if="!account.teams.length"
    >
      <md-button
        @click="showsCreateTeamDialog = true"
      >
        <md-icon>add</md-icon>
        Add first team
      </md-button>
    </div>

    <!-- チームが存在する場合 -->
    <div
      v-if="account.teams.length"
    >

      <!-- ヘッダー -->
      <div
        class="team-list-header"
      >
        <md-button
          @click="showsCreateTeamDialog = true"
        >
          <md-icon>add</md-icon>
          Add new team
        </md-button>
      </div>

      <!-- チーム一覧 -->
      <ul>
        <li
          v-for="team in account.teams"
          :key="team.id"
        >
          <md-card>
            <a
              @click="onTeamSelected(team.id)"
            >
              {{ team.name }}
              <md-divider />
              <span>{{ `スプリント ${team.sprintNumber}` }}</span>
              <span>{{ `残アイテム数 ${team.restItemCount}` }}</span>
              <span>{{ `残ポイント数 ${team.restPointCount}` }}</span>
            </a>
          </md-card>
        </li>
      </ul>
    </div>

    <!-- create team dialog -->
    <md-dialog
      :md-active.sync="showsCreateTeamDialog"
    >
      <DialogContent
        :uid="account.authUser ? account.authUser.uid : ''"
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
import { mapActions } from 'vuex'
import router from './../router'
// components
import DialogContent from './CreateTeamDialogContent'

export default {
  components: {
    DialogContent
  },
  props: {
    account: Object
  },
  data () {
    return {
      'showsCreateTeamDialog': false,
      'isCorrectlyCreated': false
    }
  },
  created () {
    if (this.account.authUser) {
      this.getTeams(this.account.authUser.uid)
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
          router.push({ name: 'teamTop', params: { 'teamId': teamId }})
        })
    }
  }
}
</script>

<style scoped lang="scss">
.md-card {
  cursor: pointer;
}
</style>
