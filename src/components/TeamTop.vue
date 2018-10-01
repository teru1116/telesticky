<template>
  <router-view
    :sprint="sprint"
    :productBacklog="productBacklog"
    :sprintItems="productBacklog.items.filter(item => {return item.isSelectedForSprint})"
    :sprintTasks="sprintTasks"
    :team="team"
  />
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: {
    account: Object,
    team: Object
  },
  computed: {
    ...mapState([
      'sprint',
      'productBacklog'
    ]),
    activeSprintId () {
      return this.team.activeSprintId
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
  }
}
</script>
