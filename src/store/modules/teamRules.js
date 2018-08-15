import teamRules from '../../api/teamRules'

const state = {
  taskStatus: [],
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
  setTeamRules (state, teamRules) {
    state.taskStatus = teamRules.status
    state.estimationUnit = teamRules.estimationUnit
  }
}

export default {
  state,
  actions,
  mutations
}
