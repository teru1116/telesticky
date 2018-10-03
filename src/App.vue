<template>
  <div>
    <!-- TODO: webpack.confを修正してheadタグにinjectする -->
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <router-view />
  </div>
</template>

<script>
import 'reset-css'
import '@/assets/sass/common.scss'

export default {
  name: 'App'
}
</script>
