import teamRules from '../../api/teamRules'

const state = {
  itemStatusList: [],
  taskStatusList: [],
  estimationUnit: '',
  initialItemStatus: 0,
  initialSprintItemStatus: 0,
  definitionsOfDone: []
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
    state.definitionsOfDone = payload.definitionsOfDone
  }
}

export default {
  state,
  actions,
  mutations
}
