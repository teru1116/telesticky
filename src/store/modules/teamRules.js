import teamRules from '../../api/teamRules'

const state = {
  itemStatusList: [],
  taskStatusList: [],
  estimationUnit: '',
  initialItemStatus: 0,
  initialSprintItemStatus: 0
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
    state.initialItemStatus = payload.initialItemStatus
    state.initialSprintItemStatus = payload.initialSprintItemStatus
  }
}

export default {
  state,
  actions,
  mutations
}
