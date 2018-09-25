import sprint from '@/api/sprint'

const initialState = {
  id: '',
  sprintNumber: 0,
  startDate: new Date(),
  endDate: new Date(),
  sprintGoal: ''
}

const state = Object.assign({}, initialState)

const actions = {
  async startSprint ({ commit }, payload) {
    commit('setSprintData', await sprint.start(payload.teamId, payload.newSprintData))
  },

  async getSprintData ({ commit }, payload) {
    commit('setSprintData', await sprint.getSprintData(payload.teamId, payload.sprintId))
  },

  async finishSprint ({ commit }, payload) {
    await sprint.finish(payload.teamId, payload.sprintId)
    commit('clearSprintData')
  }
}

const mutations = {
  setSprintData (state, payload) {
    for (let key in state) {
      if (payload.hasOwnProperty(key)) {
        state[key] = payload[key]
      }
    }
  },

  clearSprintData (state) {
    for (let key in state) {
      if (initialState.hasOwnProperty(key)) {
        state[key] = initialState[key]
      }
    }
  }
}

export default {
  state,
  actions,
  mutations
}
