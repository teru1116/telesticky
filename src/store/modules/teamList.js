import api from './../../api/teamList'

const state = []

const actions = {
  getTeamList ({ commit }, uid) {
    return new Promise((resolve, reject) => {
      api.getTeamList(uid)
      .then(teams => {
        commit('setTeamList', teams)
        resolve()
      })
      .catch(error => reject(error))
    })
  },

  createTeam ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.createTeam(payload.uid, payload.newTeam)
        .then(teams => {
          commit('setTeamList', teams)
          resolve()
        })
        .catch(error => reject(error))
    })
  }
}

const mutations = {
  setTeamList (state, payload) {
    state.splice(0, state.length)
    payload.forEach(team => {
      state.push(team)
    })
  }
}

export default {
  state,
  actions,
  mutations
}
