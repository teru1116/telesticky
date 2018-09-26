import productBacklog from '@/api/productBacklog'

const state = {
  items: [],
  tasks: {}
}

const actions = {
  listenItemsAndTasks ({ commit }, payload) {
    const teamId = payload.teamId
    productBacklog.listenItems(teamId, items => {
      commit('setItems', items)

      if (!items.length) return

      // 取得したアイテムに紐づいたタスクもリッスンする
      const itemIds = items.map(item => { return item.id })
      productBacklog.listenTasks(teamId, itemIds, tasks => commit('setTasks', tasks))
    })
  },

  async addItem ({ commit }, payload) {
    await productBacklog.addItem(payload.teamId, payload.newItem).catch(error => { throw new Error(error) })
  },

  moveItem ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      productBacklog.moveItem(
        payload.teamId,
        payload.movedItem,
        payload.newIndex,
        payload.oldIndex,
        payload.isRaised,
        payload.relatedItems
      )
        .then(() => {
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  updateItem ({ commit }, payload) {
    const teamId = payload.teamId
    const itemId = payload.itemId
    const item = payload.item

    return new Promise((resolve, reject) => {
      productBacklog.updateItem(teamId, itemId, item)
        .then(() => resolve())
        .catch(error => reject(error))
    })
  },

  changeSprintItem ({ commit }, payload) {
    const teamId = payload.teamId
    const checkedItems = payload.checkedItems
    const uncheckedItems = payload.uncheckedItems

    return new Promise((resolve, reject) => {
      productBacklog.changeSprintItem(teamId, checkedItems, uncheckedItems)
        .then(() => resolve())
        .catch(error => reject(error))
    })
  },

  deleteItem ({ commit }, payload) {
    const teamId = payload.teamId
    const itemId = payload.itemId

    return new Promise((resolve, reject) => {
      productBacklog.deleteItem(teamId, itemId)
        .then(() => resolve())
        .catch(error => reject(error))
    })
  },

  addTask ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      productBacklog.addTask(payload.teamId, payload.itemId, payload.newTask).then(() => {
        resolve()
      }, error => {
        reject(error)
      })
    })
  },

  moveTask ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      productBacklog.moveTask(
        payload.teamId,
        payload.itemId,
        payload.taskId,
        payload.status
      )
        .then(() => {
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  }
}

const mutations = {
  // FIXME: 一旦ProductBacklogの更新が発生したら全入れ替え
  setItems (state, items) {
    state.items = items
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
