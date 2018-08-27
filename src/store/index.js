import Vue from 'vue'
import Vuex from 'vuex'
// modules
import productBacklog from './modules/productBacklog'
import sprint from './modules/sprint'
import members from './modules/members'
import team from './modules/team'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    productBacklog,
    sprint,
    members,
    team
  }
})
