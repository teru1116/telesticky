import api from '../../api/productBacklog'

const state = {
  items: [],
  tasks: {}
}

const actions = {
  listenItems ({ commit }, payload) {
    api.listenItems(payload.teamId, items => {
      commit('setItems', items)

      if (!items.length) return

      let itemIds = []
      items.forEach(item => {
        itemIds.push(item.id)
      })

      api.listenTasks(payload.teamId, itemIds, tasks => {
        commit('setTasks', tasks)
      })
    })
  },

  addItem ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.addItem(payload.teamId, payload.newItem).then(() => {
        resolve()
      }, error => {
        reject(error)
      })
    })
  },

  moveItem ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.moveItem(
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
      api.updateItem(teamId, itemId, item)
        .then(() => resolve())
        .catch(error => reject(error))
    })
  },

  changeSprintItem ({ commit }, payload) {
    const teamId = payload.teamId
    const checkedItems = payload.checkedItems
    const uncheckedItems = payload.uncheckedItems

    return new Promise((resolve, reject) => {
      api.changeSprintItem(teamId, checkedItems, uncheckedItems)
        .then(() => resolve())
        .catch(error => reject(error))
    })
  },

  deleteItem ({ commit }, payload) {
    const teamId = payload.teamId
    const itemId = payload.itemId

    return new Promise((resolve, reject) => {
      api.deleteItem(teamId, itemId)
        .then(() => resolve())
        .catch(error => reject(error))
    })
  },

  addTask ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.addTask(payload.teamId, payload.itemId, payload.newTask).then(() => {
        resolve()
      }, error => {
        reject(error)
      })
    })
  },

  moveTask ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.moveTask(
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
