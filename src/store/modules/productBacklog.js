import productBacklog from '@/api/productBacklog'

const state = {
  items: [],
  tasks: {}
}

const actions = {
  // アイテムとタスクをリッスン
  listenItemsAndTasks ({ commit }, payload) {
    const teamId = payload.teamId
    productBacklog.listenItems(teamId, items => {
      commit('setItems', items)

      if (!items.length) return

      // 取得したアイテムに紐づいたタスクもリッスンする
      const itemIds = items.map(item => { return item.id })
      productBacklog.listenTasks(teamId, itemIds, tasks => {
        commit('setTasks', tasks)
      }, error => {
        throw new Error(error)
      })
    }, error => {
      throw new Error(error)
    })
  },

  async addItem ({ commit }, payload) {
    await productBacklog.addItem(payload.teamId, payload.newItem)
      .catch(error => { throw new Error(error) })
  },

  async moveItem ({ commit }, payload) {
    await productBacklog.moveItem(payload.teamId, payload.movedItem, payload.newIndex, payload.oldIndex, payload.isRaised, payload.sandwichedItems)
      .catch(error => { throw new Error(error) })
  },

  async updateItem ({ commit }, payload) {
    await productBacklog.updateItem(payload.teamId, payload.itemId, payload.newItem)
      .catch(error => { throw new Error(error) })
  },

  async changeSprintItem ({ commit }, payload) {
    await productBacklog.changeSprintItem(payload.teamId, payload.checkedItems, payload.uncheckedItems)
      .catch(error => { throw new Error(error) })
  },

  async deleteItem ({ commit }, payload) {
    await productBacklog.deleteItem(payload.teamId, payload.itemId)
      .catch(error => { throw new Error(error) })
  },

  async addTask ({ commit }, payload) {
    await productBacklog.addTask(payload.teamId, payload.itemId, payload.newTask)
      .catch(error => { throw new Error(error) })
  },

  async moveTask ({ commit }, payload) {
    await productBacklog.moveTask(payload.teamId, payload.itemId, payload.taskId, payload.status)
      .catch(error => { throw new Error(error) })
  }
}

const mutations = {
  setItems (state, payload) {
    state.items = payload
  },

  setTasks (state, payload) {
    state.tasks = payload
  }
}

export default {
  state,
  actions,
  mutations
}
