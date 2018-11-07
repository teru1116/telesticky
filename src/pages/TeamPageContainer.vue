<template>
  <div>
    <main>
      <div class="main-inner">
        <router-view
          :team="team"
          :sprint="sprint"
          :productBacklog="productBacklog"
          :sprintItems="sprintItems"
          :sprintTasks="sprintTasks"
        />
      </div>
    </main>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import GlobalNavHeader from '@/components/GlobalNavHeader'

export default {
  name: 'TeamPageContainer',
  props: {
    account: Object,
    team: Object
  },
  computed: {
    ...mapState([
      'sprint',
      'productBacklog'
    ]),
    sprintItems () {
      return this.productBacklog.items.filter(item => item.isSelectedForSprint)
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
    },
    activeSprintId () {
      return this.team.activeSprintId
    }
  },
  watch: {
    // team.activeSprintIdを監視し、更新されたらSprint Dataを読み込んでステートにセット
    activeSprintId () {
      if (!this.activeSprintId) return
      this.$store.dispatch('getSprintData', {
        teamId: this.team.id,
        sprintId: this.team.activeSprintId
      })
    }
  },
  created () {
    const teamId = this.$route.params.teamId

    // storeにチーム情報をセットする
    this.$store.dispatch('getTeam', this.$route.params.teamId)

    // Local StorageにteamIdがない場合は書き込む
    const tid = localStorage.getItem('tid')
    if (!tid || tid !== teamId) {
      localStorage.setItem('tid', teamId)
    }

    // プロダクトバックログ リッスン開始
    this.$store.dispatch('listenItemsAndTasks', { teamId: teamId })
  },
  components: {
    GlobalNavHeader
  }
}
</script>
