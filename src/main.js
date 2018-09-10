import Vue from 'vue'
import App from '@/App'
import router from '@/router'
import store from '@/store'

// vue-material
import { MdCard, MdDialog, MdButton, MdSnackbar } from 'vue-material/dist/components'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'

Vue.use(MdCard)
Vue.use(MdDialog)
Vue.use(MdButton)
Vue.use(MdSnackbar)

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
