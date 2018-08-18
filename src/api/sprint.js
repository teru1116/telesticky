import firebase from '../firebase'

const db = firebase.firestore()
const settings = {
  timestampsInSnapshots: true
}
db.settings(settings)

const teamId = location.pathname.split('/')[2]
const teamRef = db.collection('ScrumTeams').doc(teamId)

export default {
  getActiveSprintId () {
    return new Promise((resolve, reject) => {
      teamRef.get().then(doc => {
        resolve(doc.data().activeSprintId)
      })
    })
  },

  listenSprintDoc (sprintId) {
    const sprintRef = teamRef.collection('Sprints').doc(sprintId)

    // listen Sprints/{activeSprint}
    return new Promise((resolve, reject) => {
      sprintRef.onSnapshot(doc => {
        resolve(doc.data())
      })
    })
  },

  listenSprintItems (sprintId) {
    const sprintItemsRef = teamRef.collection('Sprints').doc(sprintId).collection('ProductBacklogItems')

    // listen Sprints/{activeSprint}/ProductBacklogItems
    return new Promise((resolve, reject) => {
      sprintItemsRef.onSnapshot(snapshot => {
        let items = []
        snapshot.forEach(doc => {
          items.push(Object.assign(doc.data(), { id: doc.id }))
        })
        resolve(items)
      })
    })
  },

  listenSprintItemTasks (sprintId, itemIds, callback) {
    const sprintItemsRef = teamRef.collection('Sprints').doc(sprintId).collection('ProductBacklogItems')

    // listen Sprints/{activeSprint}/ProductBacklogItems/{eachItem}/Tasks
    let tasks = {}
    itemIds.forEach((itemId, index) => {
      sprintItemsRef.doc(itemId).collection('Tasks').onSnapshot(snapshot => {
        tasks[itemId] = []
        snapshot.forEach(doc => {
          let data = doc.data()
          if (!tasks[itemId][data.status]) tasks[itemId][data.status] = []
          tasks[itemId][data.status].push(Object.assign(data, { id: doc.id }))
        })
        callback(tasks)
      })
    })
  },

  createSprint (sprint, callback) {
    const newDocRef = teamRef.collection('Sprints').doc()
    const newDocId = newDocRef.id
    const itemsRef = teamRef.collection('Sprints').doc(newDocId).collection('ProductBacklogItems')

    // 一括書き込み開始
    const batch = db.batch()

    // SprintsコレクションにDocを新規追加
    batch.set(newDocRef, {
      sprintNumber: sprint.sprintNumber,
      startDate: sprint.startDate,
      endDate: sprint.endDate,
      sprintGoal: sprint.sprintGoal,
      planDescription: sprint.planDescription
    })

    // sprintドキュメントにProductBacklogItemsコレクションを作成
    sprint.items.forEach(item => {
      batch.set(itemsRef.doc(item.id), item)
    })

    // teamドキュメントのactiveSprintIdを更新
    batch.update(teamRef, {
      activeSprintId: newDocId
    })

    // commit
    return new Promise((resolve, reject) => {
      batch.commit().then(() => {
        callback()
      })
    })
  },

  addTask (sprintId, itemId, newTask) {
    const tasksRef = teamRef.collection('Sprints').doc(sprintId).collection('ProductBacklogItems').doc(itemId).collection('Tasks')

    return new Promise((resolve, reject) => {
      tasksRef.add({
        title: newTask.title,
        status: newTask.status
      })
        .then(doc => {
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  updateTask (sprintId, itemId, taskId, task) {
    const taskRef = teamRef.collection('Sprints').doc(sprintId).collection('ProductBacklogItems').doc(itemId).collection('Tasks').doc(taskId)

    return new Promise((resolve, reject) => {
      taskRef.update({
        title: task.title,
        status: task.status
      })
        .then(doc => {
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  }
}
