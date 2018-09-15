import firebase from '@/firebase'

const db = firebase.firestore()
const settings = {
  timestampsInSnapshots: true
}
db.settings(settings)

export default {
  listenItems (teamId, callback) {
    db.collection('scrumTeams').doc(teamId).collection('productBacklog').orderBy('order')
      .onSnapshot(snapshot => {
        let results = []
        snapshot.forEach(doc => {
          results.push(Object.assign(doc.data(), { id: doc.id }))
        })
        callback(results)
      }, error => {
        console.error(error)
      })
  },

  addItem (teamId, newItem) {
    return new Promise((resolve, reject) => {
      return db.runTransaction(transaction => {
        const teamRef = db.collection('scrumTeams').doc(teamId)
        const pbRef = teamRef.collection('productBacklog')
        return transaction.get(teamRef).then(doc => {
          const data = doc.data()
          const newCount = data.totalItemCount + 1
          const newItemRef = pbRef.doc()
          transaction.set(newItemRef, Object.assign(newItem, {
            number: newCount,
            order: newCount,
            isSelectedForSprint: false
          }))
          transaction.update(teamRef, { totalItemCount: newCount })
        })
      }).then(() => {
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  moveItem (teamId, movedItem, newIndex, oldIndex, isRaised, relatedItems) {
    const batch = db.batch()
    const pbRef = db.collection('scrumTeams').doc(teamId).collection('productBacklog')

    // 移動分
    let diff = 0
    // order値を下げた場合
    if (isRaised) {
      // 動かしたアイテムのorderを更新
      diff = oldIndex - newIndex
      batch.update(pbRef.doc(movedItem.id), { order: movedItem.order - diff })
      // 影響を受けたアイテムのorderを更新
      relatedItems.forEach((item, index) => {
        if (item.id === movedItem.id) return
        batch.update(pbRef.doc(item.id), { order: item.order + 1 })
      })
    }
    // order値を上げた場合
    if (!isRaised) {
      // 動かしたアイテムのorderを更新
      diff = newIndex - oldIndex
      batch.update(pbRef.doc(movedItem.id), { order: movedItem.order + diff })
      // 影響を受けたアイテムのorderを更新
      relatedItems.forEach((item, index) => {
        if (item.id === movedItem.id) return
        batch.update(pbRef.doc(item.id), { order: item.order - 1 })
      })
    }

    // commit
    return new Promise((resolve, reject) => {
      batch.commit().then(() => {
        resolve()
      })
    })
  },

  updateItem (teamId, itemId, item) {
    return new Promise((resolve, reject) => {
      db.collection('scrumTeams').doc(teamId).collection('productBacklog').doc(itemId).update(item)
        .then(() => resolve())
        .catch(error => reject(error))
    })
  },

  changeSprintItem (teamId, items) {
    const batch = db.batch
    items.forEach(item => {
      batch.update(db.collection('scrumTeams').doc(teamId).collection('productBacklog').doc(item.id), {
        isSelectedForSprint: true
      })
    })
    return new Promise((resolve, reject) => {
      batch.commit().then(() => {
        resolve()
      })
    })  
  },

  deleteItem (teamId, itemId) {
    return new Promise((resolve, reject) => {
      db.collection('scrumTeams').doc(teamId).collection('productBacklog').doc(itemId).delete()
        .then(() => resolve())
        .catch(error => reject(error))
    })
  },

  listenTasks (teamId, itemIds, callback) {
    let tasks = {}
    const pbRef = db.collection('scrumTeams').doc(teamId).collection('productBacklog')
    itemIds.forEach((itemId, index) => {
      pbRef.doc(itemId).collection('tasks').onSnapshot(snapshot => {
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

  addTask (teamId, itemId, newTask) {
    const tasksRef = db.collection('scrumTeams').doc(teamId).collection('productBacklog').doc(itemId).collection('tasks')

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

  moveTask (teamId, itemId, taskId, status) {
    const taskRef = db.collection('scrumTeams').doc(teamId).collection('productBacklog').doc(itemId).collection('tasks').doc(taskId)

    return new Promise((resolve, reject) => {
      taskRef.update({status: status})
        .then(() => {
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  }
}
