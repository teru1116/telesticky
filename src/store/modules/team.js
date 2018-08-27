import team from '../../api/team'

const state = {
  // basic
  teamName: '',
  // scrum
  sprintDuration: 0,
  definitionsOfDone: [],
  // planning
  estimationUnit: '',
  // work flow
  itemStatusList: [],
  taskStatusList: [],
  initialItemStatus: 0,
  initialSprintItemStatus: 0,
  // computed value
  activeSprintId: '',
  totalSprintCount: 0,
  totalItemCount: 0,
  doneItemCount: 0
}

// getters

const actions = {
  getTeam ({ commit }) {
    team.get(teamData => {
      commit('setTeam', teamData)
    })
  },

  updateTeamSettings ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      team.update(payload).then(() => {
        resolve()
        commit('setTeam', payload)
      }, error => {
        reject(error)
      })
    })
  }
}

const mutations = {
  setTeam (state, payload) {
    // basic
    state.teamName = payload.teamName || state.teamName
    // scrum
    state.sprintDuration = payload.sprintDuration || state.sprintDuration
    state.definitionsOfDone = payload.definitionsOfDone || state.definitionsOfDone
    // planning
    state.estimationUnit = payload.estimationUnit || state.estimationUnit
    // work flow
    state.itemStatusList = payload.itemStatusList || state.itemStatusList
    state.taskStatusList = payload.taskStatusList || state.taskStatusList
    state.initialItemStatus = payload.initialItemStatus || state.initialItemStatus
    state.initialSprintItemStatus = payload.initialSprintItemStatus || state.initialSprintItemStatus
    // computed value
    state.activeSprintId = payload.activeSprintId || state.activeSprintId
    state.totalSprintCount = payload.totalSprintCount || state.totalSprintCount
    state.totalItemCount = payload.totalItemCount || state.totalItemCount
    state.doneItemCount = payload.doneItemCount || state.doneItemCount
  }
}

export default {
  state,
  actions,
  mutations
}
