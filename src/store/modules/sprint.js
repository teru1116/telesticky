import api from '../../api/sprint'

// initial state
const state = {
  id: '',
  sprintNumber: 0,
  startDate: new Date(),
  endDate: new Date(),
  sprintGoal: '',
  planDescription: ''
}

// actions
const actions = {
  createAndStartSprint ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.createAndStartSprint(payload.teamId, payload.newSprint)
        .then(sprintId => resolve(sprintId))
        .catch(error => reject(error))
    })
  },

  listenSprint ({ commit }, payload) {
    api.getActiveSprintId(payload.teamId).then(activeSprintId => {
      commit('setActiveSprintId', activeSprintId)

      api.listenSprint(payload.teamId, payload.activeSprintId, sprintData => {
        commit('setSprintData', sprintData)
      })
    })
  },

  finishCurrentSprint ({ commit }, payload) {
    const teamId = payload.teamId
    const sprintId = payload.sprintId

    return new Promise((resolve, reject) => {
      api.finishCurrentSprint(teamId, sprintId)
        .then(() => {
          commit('setActiveSprintId', '')
          commit('setSprintData', {
            sprintNumber: 0,
            startDate: '',
            endDate: '',
            sprintGoal: '',
            planDescription: ''
          })
          resolve()
        })
        .catch(error => reject(error))
    })
  }
}

// mutations
const mutations = {
  setActiveSprintId (state, activeSprintId) {
    state.id = activeSprintId
  },

  setSprintData (state, payload) {
    if (!payload) return
    state.sprintNumber = payload.sprintNumber
    state.startDate = payload.startDate
    state.endDate = payload.endDate
    state.sprintGoal = payload.sprintGoal
    state.planDescription = payload.planDescription
  }
}

export default {
  state,
  actions,
  mutations
}
