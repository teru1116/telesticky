import teamList from '@/api/teamList'

const state = []

const actions = {
  async getTeamList ({ commit }, uid) {
    const teams = await teamList.get(uid).catch(error => { throw new Error(error) })
    commit('setTeamList', teams)
  },

  async createTeam ({ commit }, payload) {
    const teams = await teamList.createTeam(payload.uid, payload.newTeam).catch(error => { throw new Error(error) })
    commit('setTeamList', teams)
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
