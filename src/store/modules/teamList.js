import api from './../../api/teamList'

let state = []

const actions = {
  getTeams ({ commit }, uid) {
    api.getTeams(uid, teams => {
      commit('setTeams', teams)
    })
  },

  createTeam ({ commit }, payload) {
    api.createTeam(payload.uid, payload.newTeam, teams => {
      commit('setTeams', teams)
    })
  }
}

const mutations = {
  setTeams (state, payload) {
    state = payload
  }
}

export default {
  state,
  actions,
  mutations
}
