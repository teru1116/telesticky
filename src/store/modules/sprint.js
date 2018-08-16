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

  createSprintAndStart ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      sprint.create(payload).then(insertedData => {
        commit('setSprintData', insertedData)
        resolve()
      }, error => {
        reject(error)
      })
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
