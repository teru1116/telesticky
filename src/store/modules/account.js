const state = {
  'authUser': null
}

const actions = {
  setAuthUser ({ state, commit }, payload) {
    if (!state.authUser) {
      commit('setAuthUser', payload)
    }
  },

  removeAuthUser ({ commit }) {
    commit('setAuthUser', null)
  }
}

const mutations = {
  setAuthUser (state, payload) {
    state.authUser = payload
  }
}

export default {
  state,
  actions,
  mutations
}
