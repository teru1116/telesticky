const state = {
  'authUser': null
}

const actions = {
  setAuthUser ({ commit }, payload) {
    commit('setAuthUser', payload)
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
