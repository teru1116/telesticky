<template>
  <div>
    <router-view
      :account="account"
      :team="team"
    />
  </div>
</template>

<script>
// vuex
import { mapState } from 'vuex'
// components
import Teams from '@/components/Teams'
import TeamTop from '@/components/TeamTop'

export default {
  components: {
    Teams,
    TeamTop
  },
  props: {
    account: Object
  },
  computed: {
    ...mapState([
      'team'
    ])
  }
}
</script>

<style lang="scss">
// dialog
.md-dialog-container {
  .md-toolbar {
    h2 {
      //
    }
  }
}

</style>
