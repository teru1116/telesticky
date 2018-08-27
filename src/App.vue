<template>
  <div id="app">
    <!-- FIXME -->
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <router-view/>
  </div>
</template>

<script>
import router from './router'
import firebase from './firebase'

export default {
  name: 'App',
  created: function () {
    // firebase auth observer
    firebase.auth().onAuthStateChanged(user => {
      user ? router.push('/teams') : router.push('/sign_in')
    })
  }
}
</script>

<style lang="scss">
html, body {
  margin: 0;
}

#app {
  .toolbar-content {
    background-color: rgba(255, 255, 255, 0.0);
    display: flex;
    height: 64px;
    margin-top: -64px;
    padding: 0 16px;

    > * {
      z-index: 12;
      margin: auto 0;
    }

    h2 {
      text-align: left;
      color: #fff;
      font-size: 20px;
      text-align: left;
      color: #fff;
    }

    .pbl-header-right {
      flex: 1;

      .md-button {
        color: #444;
        background-color: #fff;
        float: right;
        margin-left: 8px;
      }
    }
  }

  .main-content-container {
    height: calc(100vh - 64px);
  }

  font-family: "SF Pro Text","SF Pro Icons","Helvetica Neue","Helvetica","Arial",sans-serif;
  color: #222222;

  h2 {
    font-size: 20px;
    font-weight: 400;
  }

  h3 {
    font-size: 16px;
    font-weight: 400;
    margin: 12px 0 4px;
  }

  p {
    font-size: 14px;
    font-weight: 400;
  }

  small {
    font-size: 12px;
    font-weight: 400;
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
  }
}

// force potisioning md-date-picker
.md-datepicker-dialog {
  top: 40%!important;

  .md-datepicker-body-content {
    height: 264px!important;
  }
}
</style>
