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

  // NOTE: listenはPromiseではリアクティブ更新がされなかったため、callback方式に差し替え
  listenSprintDoc (sprintId, callback) {
    const sprintRef = teamRef.collection('Sprints').doc(sprintId)

    // listen Sprints/{activeSprint}
    sprintRef.onSnapshot(doc => {
      callback(doc.data())
    })
  },

  listenSprintItems (sprintId, callback) {
    const sprintItemsRef = teamRef.collection('Sprints').doc(sprintId).collection('ProductBacklogItems')

    // listen Sprints/{activeSprint}/ProductBacklogItems
    sprintItemsRef.orderBy('order').onSnapshot(snapshot => {
      let items = []
      snapshot.forEach(doc => {
        items.push(Object.assign(doc.data(), { id: doc.id }))
      })
      callback(items)
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
        // NOTE: tasksが全部揃ってからcallback()を呼ぶ. 逐一呼ぶと最初しかObserverが付加されなかったため
        if (Object.keys(tasks).length === itemIds.length) {
          callback(tasks)
        }
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
      sprintGoal: sprint.sprintGoal
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
        resolve()
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
  },

  moveProductBacklogItem (sprintId, movedItem, newIndex, oldIndex, isRaised, relatedItems) {
    const batch = db.batch()
    const pblRef = teamRef.collection('ProductBacklog')
    const sprintPblItemRef = teamRef.collection('Sprints').doc(sprintId).collection('ProductBacklogItems')

    // 移動分
    let diff = 0
    // order値を下げた場合
    if (isRaised) {
      // 動かしたアイテムのorderを更新
      diff = oldIndex - newIndex
      batch.update(pblRef.doc(movedItem.id), { order: movedItem.order - diff })
      batch.update(sprintPblItemRef.doc(movedItem.id), { order: movedItem.order - diff })
      // 影響を受けたアイテムのorderを更新
      relatedItems.forEach((item, index) => {
        if (item.id === movedItem.id) return
        batch.update(pblRef.doc(item.id), { order: item.order + 1 })
        batch.update(sprintPblItemRef.doc(item.id), { order: item.order + 1 })
      })
    }
    // order値を上げた場合
    if (!isRaised) {
      // 動かしたアイテムのorderを更新
      diff = newIndex - oldIndex
      batch.update(pblRef.doc(movedItem.id), { order: movedItem.order + diff })
      batch.update(sprintPblItemRef.doc(movedItem.id), { order: movedItem.order + diff })
      // 影響を受けたアイテムのorderを更新
      relatedItems.forEach((item, index) => {
        if (item.id === movedItem.id) return
        batch.update(pblRef.doc(item.id), { order: item.order - 1 })
        batch.update(sprintPblItemRef.doc(item.id), { order: item.order - 1 })
      })
    }

    // commit
    return new Promise((resolve, reject) => {
      batch.commit().then(() => {
        resolve()
      })
    })
  }
}
