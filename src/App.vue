<template>
  <div>
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
    margin: 0;
    &.primary-button {
      background-color: #7b68ee;
      color: #fff;
    }
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
  position: relative;
  height: 40px;
  margin: 8px 0 0;
  border-bottom: 1px solid #d5d5d5;
  > * {
    position: absolute;
    bottom: 8px;
  }
  h2 {
    font-size: 28px;
    line-height: 28px;
  }
  .header-items {
    right: 0;
    > * {
      float: right;
      margin-left: 16px;
    }
  }
}

.md-dialog-container {
  background-color: #fff;
}
</style>
