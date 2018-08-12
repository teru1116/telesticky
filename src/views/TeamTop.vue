<template>
  <div>
    <router-view
      :teamId="teamId"
    />
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      teamId: ''
    }
  },
  created: function () {
    this.teamId = this.$route.params['teamId']
  }
}
</script>
