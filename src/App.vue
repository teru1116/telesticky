<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
#app {
  font-family: "SF Pro Text","SF Pro Icons","Helvetica Neue","Helvetica","Arial",sans-serif;
  color: #222222;

  h2 {
    font-size: 24px;
    font-weight: lighter;
  }

  h3 {
    font-size: 18px;
    font-weight: lighter;
    margin: 12px 0 4px;
  }

  p {
    font-size: 14px;
    font-weight: lighter;
  }

  small {
    font-size: 12px;
    font-weight: 100;
  }

  button {
    cursor: pointer;
    text-align: center;
    padding: 3px 10px 4px;
    -moz-border-radius: 3px;
    -webkit-border-radius: 3px;
    border-radius: 3px;
    border: 1px solid #4cabff;
    outline: none;
    color: #0088ff;
    font-size: 15px;
    line-height: 19px;
  }
}
</style>
