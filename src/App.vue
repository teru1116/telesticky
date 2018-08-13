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
html, body {
  margin: 0;
}

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
    font-weight: lighter;
    display: block;
    margin: 4px 0 8px;
  }

  a {
    text-decoration: none;
  }

  ul, ol {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  button {
    cursor: pointer;
    text-align: center;
    padding: 3px 10px 4px;
    -moz-border-radius: 3px;
    -webkit-border-radius: 3px;
    border-radius: 3px;
    border: 1px solid #d9d9d9;
    color: #d9d9d9;
    outline: none;
    font-size: 15px;
    line-height: 19px;

    &.enabled {
      border: 1px solid #4cabff;
      color: #0088ff;
    }
  }
}
</style>
