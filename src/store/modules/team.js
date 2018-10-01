import team from '@/api/team'

const initialState = {
  id: '',
  name: '',
  sprintDuration: 0,
  definitionsOfDone: [],
  estimationUnit: '',
  itemStatusList: [],
  taskStatusList: [],
  initialItemStatus: 0,
  initialSprintItemStatus: 0,
  activeSprintId: '',
  totalSprintCount: 0,
  totalItemCount: 0,
  doneItemCount: 0
}

const state = Object.assign({}, initialState)

const actions = {
  async getTeam ({ commit }, teamId) {
    const teamData = await team.get(teamId).catch(error => { throw new Error(error) })
    commit('setTeam', teamData)
  },

  async updateTeamSettings ({ commit }, payload) {
    await team.update(payload.teamId, payload.teamSettings).catch(error => { throw new Error(error) })
    commit('setTeam', payload.teamSettings)
  },

  async unsetTeam ({ commit }) {
    commit('unsetTeam')
  },

  async deleteTeam ({ commit }, teamId) {
    await team.delete(teamId).catch(error => { throw new Error(error) })
    commit('unsetTeam')
  }
}

const mutations = {
  setTeam (state, payload) {
    for (let key in payload) {
      state[key] = payload[key]
    }
  },

  unsetTeam (state) {
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
