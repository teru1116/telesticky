import sprint from '../../api/sprint'

// initial state
const state = {
  id: '', // Sprintデータへのクエリ発行用
  items: [], // Sprints/{doc}/ProductBacklogItems. [{productBacklogObject}, ...]
  tasks: {}, // Sprints/{doc}/ProductBacklogItems/{doc}/Tasks. {itemId: [{taskObject}, ...]}
  sprintNumber: 0,
  startDate: new Date(),
  endDate: new Date(),
  sprintGoal: '',
  planDescription: ''
}

// getters
const getters = {}

// actions
const actions = {
  createSprintAndStart ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      sprint.createSprint(payload).then(insertedData => {
        resolve()
      }, error => {
        reject(error)
      })
    })
  },

  listenActiveSprint ({ commit }) {
    sprint.getActiveSprintId()
      .then(activeSprintId => {
        commit('setActiveSprintId', activeSprintId)

        sprint.listenSprintDoc(activeSprintId)
          .then(sprintData => {
            commit('setSprintData', sprintData)
          })

        sprint.listenSprintItems(activeSprintId)
          .then(items => {
            commit('setItems', items)

            let itemIds = []
            items.forEach(item => {
              itemIds.push(item.id)
            })

            sprint.listenSprintItemTasks(activeSprintId, itemIds, (tasks) => {
              commit('setTasks', tasks)
            })
          })
      })
  },

  addTask ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      sprint.addTask(payload.sprintId, payload.itemId, payload.newTask)
        .then(() => {
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  updateTask ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      sprint.updateTask(payload.sprintId, payload.itemId, payload.taskId, payload.task)
        .then(() => {
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  }
}

// mutations
const mutations = {
  setActiveSprintId (state, activeSprintId) {
    state.id = activeSprintId
  },

  setSprintData (state, payload) {
    if (!payload) return
    state.sprintNumber = payload.sprintNumber
    state.startDate = payload.startDate
    state.endDate = payload.endDate
    state.sprintGoal = payload.sprintGoal
    state.planDescription = payload.planDescription
  },

  setItems (state, payload) {
    state.items = payload
  },

  setTasks (state, payload) {
    state.tasks = payload
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
