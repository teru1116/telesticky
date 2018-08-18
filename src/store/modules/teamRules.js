import teamRules from '../../api/teamRules'

const state = {
  itemStatusList: [],
  taskStatusList: [],
  estimationUnit: ''
}

// getters

const actions = {
  getTeamRules ({ commit }) {
    teamRules.get(teamRules => {
      commit('setTeamRules', teamRules)
    })
  }
}

const mutations = {
  setTeamRules (state, payload) {
    state.taskStatusList = payload.taskStatusList
    state.estimationUnit = payload.estimationUnit
    state.itemStatusList = payload.itemStatusList
  }
}

export default {
  state,
  actions,
  mutations
}
