<template>
  <li>
    <h3>
      {{ data.title }}
    </h3>
    <span>
      {{ data.estimate + estimationUnit }}
    </span>
  </li>
</template>

<script>
export default {
  props: {
    data: Object,
    estimationUnit: String
  }
}
</script>
