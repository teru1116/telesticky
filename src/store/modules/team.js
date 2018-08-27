import team from '../../api/team'

const state = {
  itemStatusList: [],
  taskStatusList: [],
  estimationUnit: '',
  sprintDuration: 0,
  initialItemStatus: 0,
  initialSprintItemStatus: 0,
  definitionsOfDone: []
}

// getters

const actions = {
  getTeam ({ commit }) {
    team.get(teamRules => {
      commit('setTeam', teamRules)
    })
  }
}

const mutations = {
  setTeam (state, payload) {
    state.taskStatusList = payload.taskStatusList
    state.estimationUnit = payload.estimationUnit
    state.itemStatusList = payload.itemStatusList
    state.initialItemStatus = payload.initialItemStatus
    state.initialSprintItemStatus = payload.initialSprintItemStatus
    state.definitionsOfDone = payload.definitionsOfDone
    state.sprintDuration = payload.sprintDuration
  }
}

export default {
  state,
  actions,
  mutations
}
