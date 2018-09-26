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
    const sprintData = await sprint.start(payload.teamId, payload.newSprintData).catch(error => { throw new Error(error) })
    commit('setSprintData', sprintData)
  },

  async getSprintData ({ commit }, payload) {
    const sprintData = await sprint.getSprintData(payload.teamId, payload.sprintId).catch(error => { throw new Error(error) })
    commit('setSprintData', sprintData)
  },

  async finishSprint ({ commit }, payload) {
    await sprint.finish(payload.teamId, payload.sprintId).catch(error => { throw new Error(error) })
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
