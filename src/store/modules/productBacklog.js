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
    return new Promise((resolve, reject) => {
      productBacklog.add(newItem).then(() => {
        commit('startUpdatePB')
        resolve()
      }, error => {
        reject(error)
      })
    })
  },

  moveProductBacklogItem ({ commit }, payload) {
    // commit('startUpdatePB')
    productBacklog.move(payload.movedItem, payload.newIndex, payload.isRaised, payload.relatedItems)
  },

  changeStatusProductBacklogItem ({ commit }, payload) {
    productBacklog.changeStatus(payload.sprintId, payload.itemId, payload.status)
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
