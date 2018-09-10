<template>
  <div id="app">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <router-view />
  </div>
</template>

<script>
import 'reset-css'
export default {}
</script>

<style lang="scss">
a, button {
  cursor: pointer;
}
a {
  &:hover{
    text-decoration: none!important;
  }
}
button {
  border: 0;
  outline: 0;
  &.md-button {
    background-color: #7b68ee;
    color: #fff!important;
    margin: 0;
  }
}
input {
  font-size: 17px;
  letter-spacing: -.021em;
  height: 34px;
  padding-left: 15px;
  padding-right: 15px;
  border: 1px solid #d6d6d6;
  border-radius: 2px;
  color: initial;
  letter-spacing: normal;
  margin: 0;
  padding: 0 12px;
  font: 400 11px system-ui;
}

.content-header {
  display: flex;
  h2 {
    font-size: 24px;
    width: 400px;
  }
  .header-items {
    flex: 1;
    * {
      float: right;
      margin-left: 16px;
    }
  }
}
</style>
