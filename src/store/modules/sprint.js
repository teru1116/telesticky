import sprint from '../../api/sprint'

// initial state
const state = {
  id: '',
  sprintNumber: 0,
  startDate: new Date(),
  endDate: new Date(),
  items: [],
  sprintGoal: '',
  planDescription: ''
}

// getters
const getters = {}

// actions
const actions = {
  getActiveSprint ({ commit }) {
    sprint.get(sprintData => {
      commit('setSprintData', sprintData)
    })
  },

  startSprint ({ commit }, payload) {
    sprint.start(payload, insertedData => {
      commit('setSprintData', insertedData)
    })
  }
}

// mutations
const mutations = {
  setSprintData (state, payload) {
    if (payload) {
      state.id = payload.id
      state.sprintNumber = payload.sprintNumber
      state.startDate = payload.startDate
      state.endDate = payload.endDate
      state.items = payload.items
      state.sprintGoal = payload.sprintGoal
      state.planDescription = payload.planDescription
    }
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
