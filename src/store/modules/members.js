import api from '@/api/members'

// initial state
let state = []

// getters

// actions
const actions = {
  getMembers ({ commit }, payload) {
    console.log(payload)
    const teamId = payload.teamId
    return new Promise((resolve, reject) => {
      api.getMembers(teamId)
        .then(members => commit('setMembers', members))
        .catch(error => reject(error))
    })
  }
}

// mutations
const mutations = {
  setMembers (state, members) {
    state.splice(0, state.length)
    members.forEach(member => state.push(member))
  }
}

export default {
  state,
  actions,
  mutations
}
