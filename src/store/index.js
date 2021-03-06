import Vue from 'vue'
import Vuex from 'vuex'
// modules
import account from './modules/account'
import teamList from './modules/teamList'
import team from './modules/team'
import productBacklog from './modules/productBacklog'
import sprint from './modules/sprint'
import members from './modules/members'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    account,
    teamList,
    team,
    productBacklog,
    sprint,
    members
  }
})
