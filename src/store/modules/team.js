import team from '../../api/team'

const state = {
  id: '',
  name: '',
  sprintDuration: 0,
  definitionsOfDone: [],
  estimationUnit: '',
  itemStatusList: [],
  taskStatusList: [],
  initialItemStatus: 0,
  initialSprintItemStatus: 0,
  activeSprintId: '',
  totalSprintCount: 0,
  totalItemCount: 0,
  doneItemCount: 0
}

const actions = {
  getTeam ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      team.get(payload.teamId, teamData => {
        commit('setTeam', teamData)
        resolve()
      })
    })
  },

  updateTeamSettings ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      team.update(payload.teamId, payload.teamSettings).then(() => {
        resolve()
        commit('setTeam', payload.teamSettings)
      }, error => {
        reject(error)
      })
    })
  },

  deleteTeam ({ commit }, payload) {
    const teamId = payload.teamId
    return new Promise((resolve, reject) => {
      team.delete(teamId).then(() => {
        const initialState = {
          id: '',
          name: '',
          sprintDuration: 0,
          definitionsOfDone: [],
          estimationUnit: '',
          itemStatusList: [],
          taskStatusList: [],
          initialItemStatus: 0,
          initialSprintItemStatus: 0,
          activeSprintId: '',
          totalSprintCount: 0,
          totalItemCount: 0,
          doneItemCount: 0
        }
        commit('setTeam', initialState)
        resolve()
      })
    })
  }
}

const mutations = {
  setTeam (state, payload) {
    state.id = payload.id || state.id
    state.name = payload.name || state.name
    state.sprintDuration = payload.sprintDuration || state.sprintDuration
    state.definitionsOfDone = payload.definitionsOfDone || state.definitionsOfDone
    state.estimationUnit = payload.estimationUnit || state.estimationUnit
    state.itemStatusList = payload.itemStatusList || state.itemStatusList
    state.taskStatusList = payload.taskStatusList || state.taskStatusList
    state.initialItemStatus = payload.initialItemStatus || state.initialItemStatus
    state.initialSprintItemStatus = payload.initialSprintItemStatus || state.initialSprintItemStatus
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
