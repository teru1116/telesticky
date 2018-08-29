import api from '../../api/productBacklog'

const state = {
  items: [],
  tasks: {}
}

const actions = {
  listenItems ({ commit }, payload) {
    api.listenItems(payload.teamId, items => {
      commit('setItems', items)

      let itemIds = []
      payload.items.forEach(item => {
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
