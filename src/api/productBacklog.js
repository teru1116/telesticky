import firebase from '../firebase'

const db = firebase.firestore()
const settings = {
  timestampsInSnapshots: true
}
db.settings(settings)

const teamId = location.pathname.split('/')[2]
const teamRef = db.collection('ScrumTeams').doc(teamId)
const pbRef = teamRef.collection('ProductBacklog')

export default {
  listenItems (callback) {
    pbRef.orderBy('order')
    // pbRef.where('isClosed', '==', false).orderBy('order')
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

  addItem (newItem) {
    return new Promise((resolve, reject) => {
      return db.runTransaction(transaction => {
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

  moveItem (movedItem, newIndex, oldIndex, isRaised, relatedItems) {
    const batch = db.batch()

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

  listenTasks (itemIds, callback) {
    let tasks = {}
    itemIds.forEach((itemId, index) => {
      pbRef.doc(itemId).collection('Tasks').onSnapshot(snapshot => {
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

  addTask (itemId, newTask) {
    const tasksRef = pbRef.doc(itemId).collection('Tasks')

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

  moveTask (itemId, taskId, status) {
    const taskRef = pbRef.doc(itemId).collection('Tasks').doc(taskId)
    taskRef.update({status: status})
      .then(() => {
        resolve()
      })
      .catch(error => {
        reject(error)
      })
  }
}
