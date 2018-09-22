import api from '@/api/account'

const state = {
  uid: '',
  email: '',
  displayName: '',
  photoURL: ''
}

const actions = {
  setAuthUser ({ state, commit }, authUser) {
    if (!state.uid) {
      commit('updateAccount', authUser)
    }
  },

  signOut ({ commit }) {
    localStorage.removeItem('tid')
    localStorage.removeItem('sid')
    commit('signOut')
  },

  updateDisplayName ({ state, commit }, payload) {
    const teamId = payload.teamId
    const uid = payload.uid
    const displayName = payload.displayName

    api.updateDisplayName(teamId, uid, displayName)
      .then(() => {
        commit('updateAccount', { displayName: displayName })
      })
  },

  updateProfilePhoto ({ state, commit }, payload) {
    const teamId = payload.teamId
    const uid = payload.uid
    const dataURL = payload.dataURL

    api.updateProfilePhoto(teamId, uid, dataURL)
      .then(photoURL => {
        commit('updateAccount', { photoURL: photoURL })
      })
  }
}

const mutations = {
  updateAccount (state, payload) {
    if (payload.hasOwnProperty('uid')) state.uid = payload.uid
    if (payload.hasOwnProperty('email')) state.email = payload.email
    if (payload.hasOwnProperty('displayName')) state.displayName = payload.displayName
    if (payload.hasOwnProperty('photoURL')) state.photoURL = payload.photoURL
  },

  signOut (state) {
    state.uid = ''
    state.email = ''
    state.displayName = ''
    state.photoURL = ''
  }
}

export default {
  state,
  actions,
  mutations
}
