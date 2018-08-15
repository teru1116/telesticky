import productBacklog from '../../api/productBacklog'

// initial state
const state = {
  productBacklog: [],
  totalItemCount: 0
}

// getters

// actions
const actions = {
  listenProductBacklog ({ commit }) {
    productBacklog.listen(productBacklog => {
      commit('setProductBacklog', productBacklog)
    })
  },

  addProductBackItem ({ commit }, newItem) {
    productBacklog.add(newItem)
  }
}

// mutations
const mutations = {
  // 一旦ProductBacklogの更新が発生したら全入れ替え
  setProductBacklog (state, productBacklog) {
    state.productBacklog = productBacklog
  }
}

export default {
  state,
  actions,
  mutations
}
