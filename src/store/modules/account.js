import api from './../../api/account'

const state = {
  'authUser': null,
  'teams': []
}

const actions = {
  setAuthUser ({ commit }, user) {
    commit('setAuthUser', user)
  },

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
  setAuthUser (state, payload) {
    state.authUser = payload
  },

  setTeams (state, payload) {
    state.teams = payload
  }
}

export default {
  state,
  actions,
  mutations
}
