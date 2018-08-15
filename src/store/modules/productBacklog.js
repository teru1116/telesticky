import productBacklog from '../../api/productBacklog'

const state = {
  // Close分を含まないプロダクトバックログ
  activeItems: [],
  // プロダクトバックログ書き込み中か
  isUpdatingPB: false
}

// TODO: getters

const actions = {
  listenProductBacklog ({ commit }) {
    productBacklog.listen(productBacklog => {
      commit('setProductBacklog', productBacklog)
    })
  },

  addProductBacklogItem ({ commit }, newItem) {
    commit('startUpdatePB')
    productBacklog.add(newItem)
  },

  moveProductBacklogItem ({ commit }, payload) {
    // commit('startUpdatePB')
    productBacklog.move(payload.movedItem, payload.newIndex, payload.isRaised, payload.relatedItems)
  }
}

const mutations = {
  // FIXME: 一旦ProductBacklogの更新が発生したら全入れ替え
  setProductBacklog (state, items) {
    state.activeItems = items
    state.isUpdatingPB = false
  },

  startUpdatePB (state) {
    state.isUpdatingPB = true
  }
}

export default {
  state,
  actions,
  mutations
}
