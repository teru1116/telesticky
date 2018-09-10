import Vue from 'vue'
import App from '@/App'
import router from '@/router'
import store from '@/store'

// vue-material
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'

Vue.use(VueMaterial)

// Vue グローバル設定
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
