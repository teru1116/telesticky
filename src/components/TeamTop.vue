<template>
  <router-view
    :sprint="sprint"
    :productBacklog="productBacklog"
    :sprintItems="productBacklog.items.filter(item => {return item.isSelectedForSprint})"
    :sprintTasks="sprintTasks"
    :team="team"
    :menuVisible="menuVisible"
  />
</template>

<script>
import { mapState, mapActions } from 'vuex'
import router from './../router'

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
    activeSprint () {
      return this.team.activeSprint
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
    ...mapActions([
      'listenItems',
      'listenSprint',
      'getTeam'
    ]),
    toggleMenu () {
      this.menuVisible = !this.menuVisible
    }
  },
  watch: {
    // activeSprintが変化したら、スプリントのリッスンを開始する
    activeSprint () {
      if (!this.activeSprint) return
      this.listenSprint({
        'teamId': this.team.id,
        'activeSprintId': this.team.activeSprint
      })
    }
  },
  created () {
    // storeにチーム情報をセットする
    const teamId = this.$route.params.teamId
    this.getTeam({ teamId: teamId })
    // teamIdをブラウザに保存し、次回直接開かれるようにする
    if (this.team.id) {
      localStorage.setItem('tid', this.team.id)
    }
    // スプリント中か否かでトップページを切り替える
    if (this.activeSprintId) {
      router.push({ name: 'sprintBacklog' })
    } else {
      router.push({ name: 'productBacklog' })
    }
    // プロダクトバックログ リッスン開始
    this.listenItems({
      'teamId': this.team.id
    })
  }
}
</script>
