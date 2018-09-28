import account from '@/api/account'

const initialState = {
  uid: '',
  email: '',
  displayName: '',
  photoURL: ''
}

const state = Object.assign({}, initialState)

const actions = {
  setAuthUser ({ commit }, authUser) {
    commit('setAccount', authUser)
  },

  signOut ({ commit }) {
    localStorage.removeItem('tid')
    localStorage.removeItem('sid')
    commit('signOut')
  },

  async updateDisplayName ({ commit }, payload) {
    await account.updateDisplayName(payload.uid, payload.displayName).catch(error => { throw new Error(error) }) 
    commit('setAccount', { displayName: payload.displayName })
  },

  async updateProfilePhoto ({ commit }, payload) {
    const photoURL = await account.updateProfilePhoto(payload.uid, payload.dataURL).catch(error => { throw new Error(error) })
    commit('setAccount', { photoURL })
  },

  async updateEmail ({ commit }, payload) {
    await account.updateEmail(payload.uid, payload.email).catch(error => { throw new Error(error) })
    commit('setAccount', { email: payload.email })
  },

  async updatePassword({ commit }, password) {
    await account.updatePassword(password).catch(error => { throw new Error(error) })
  },

  async deleteAccount ({ commit }) {
    await account.delete().catch(error => { throw new Error(error) })
    dispatchEvent('signOut')
  }
}

const mutations = {
  setAccount (state, payload) {
    for (let key in payload) {
      state[key] = payload[key]
    }
  },

  signOut (state) {
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
