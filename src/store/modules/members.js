import members from '@/api/members'

const state = []

const actions = {
  async getMembers ({ commit }, teamId) {
    const teamMembers = await members.get(teamId).catch(error => { throw new Error(error) })
    commit('setMembers', teamMembers)
  },

  async addMember ({ commit }, payload) {
    const member = await members.add(payload.teamId, payload.email).catch(error => { throw new Error(error) })
    commit('addMember', member)
  }
}

const mutations = {
  setMembers (state, members) {
    state.splice(0, state.length)
    members.forEach(member => state.push(member))
  },

  addMember (state, member) {
    state.push(member)
  }
}

export default {
  state,
  actions,
  mutations
}
