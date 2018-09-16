<template>
  <div
    class="inner"
  >
    <!-- -->
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  props: {
    team: Object
  },
  computed: {
    ...mapState([
      'members'
    ])
  },
  methods: {
    ...mapActions([
      'getMembers'
    ])
  },
  created () {
    this.getMembers({ teamId: this.team.id })
  }
}
</script>