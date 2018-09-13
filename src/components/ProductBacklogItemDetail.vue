<template>
  <md-button
    @click="$router.push({ name: 'productBacklog' })"
  >
    <md-icon>clear</md-icon>
  </md-button>
</template>

<script>
export default {
  props: {
    item: Object
  }
}
</script>
