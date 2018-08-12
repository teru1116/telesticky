<template>
  <li>
    {{ data.id, data.title }}
  </li>
</template>

<script>
export default {
  props: {
    data: Object
  }
}
</script>
