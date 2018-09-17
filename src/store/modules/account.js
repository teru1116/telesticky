import api from '@/api/account'

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
  },

  updateDisplayName({ state, commit }, payload) {
    const teamId = payload.teamId
    const uid = payload.uid
    const displayName = payload.displayName

    api.updateDisplayName(teamId, uid, displayName)
      .then(() => {
        let param = state.authUser
        param.displayName = displayName
        commit('setAuthUser', param)
      })
  }
}

const mutations = {
  setAuthUser (state, payload) {
    console.log(payload)
    state.authUser = payload
  }
}

export default {
  state,
  actions,
  mutations
}
