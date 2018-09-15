<template>
  <textarea
    v-bind:value="value"
    v-on:input="$emit('input', $event.target.value)"
  />
</template>

<script>
export default {
  props: {
    value: String
  }
}
</script>
