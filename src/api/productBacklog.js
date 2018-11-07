import firebase from '@/firebase'
const db = firebase.firestore()

export default {
  listenItems (teamId, onNext, onError) {
    db.collection('teams').doc(teamId).collection('productBacklog').orderBy('order').onSnapshot(snapshot => {
      let results = []
      snapshot.forEach(doc => {
        results.push(Object.assign(doc.data(), { id: doc.id }))
      })
      onNext(results)
    }, error => {
      onError(error)
    })
  },

  listenTasks (teamId, itemIds, onNext, onError) {
    const tasks = {}
    itemIds.forEach(itemId => {
      db.collection('teams').doc(teamId).collection('productBacklog').doc(itemId).collection('tasks').onSnapshot(snapshot => {
        tasks[itemId] = []
        snapshot.forEach(doc => {
          let data = doc.data()
          if (!tasks[itemId][data.status]) {
            tasks[itemId][data.status] = []
          }
          tasks[itemId][data.status].push(Object.assign(data, { id: doc.id }))
        })

        // 全てのタスクがtasksに追加されたらコールバック
        if (Object.keys(tasks).length === itemIds.length) {
          onNext(tasks)
        }
      }, error => {
        onError(error)
      })
    })
  },

  async addItem (teamId, newItem) {
    const teamRef = db.collection('teams').doc(teamId)
    const newItemRef = teamRef.collection('productBacklog').doc()

    // チームの合計アイテム数に基づいて、アイテムにインクリメントされた番号を登録するため、トランザクションを使用
    await db.runTransaction(async transaction => {
      const doc = await transaction.get(teamRef).catch(error => { throw new Error(error) })
      const itemNumber = doc.data().totalItemCount + 1
      // アイテムを新規追加
      transaction.set(newItemRef, Object.assign(newItem, {
        number: itemNumber,
        order: itemNumber,
        isSelectedForSprint: false
      }))
      // チームの合計アイテム数を更新
      transaction.update(teamRef, {
        totalItemCount: itemNumber
      })
    }).catch(error => { throw new Error(error) })
  },

  async moveItem (teamId, movedItem, newIndex, oldIndex, isRaised, sandwichedItems) {
    const batch = db.batch()
    const productBacklogRef = db.collection('teams').doc(teamId).collection('productBacklog')

    // 移動分
    let diff = 0
    // order値を下げた場合
    if (isRaised) {
      // 動かしたアイテムのorderを更新
      diff = oldIndex - newIndex
      batch.update(productBacklogRef.doc(movedItem.id), { order: movedItem.order - diff })
      // 影響を受けたアイテムのorderを更新
      sandwichedItems.forEach(item => {
        if (item.id === movedItem.id) return
        batch.update(productBacklogRef.doc(item.id), { order: item.order + 1 })
      })
    }
    // order値を上げた場合
    if (!isRaised) {
      // 動かしたアイテムのorderを更新
      diff = newIndex - oldIndex
      batch.update(productBacklogRef.doc(movedItem.id), { order: movedItem.order + diff })
      // 影響を受けたアイテムのorderを更新
      sandwichedItems.forEach(item => {
        if (item.id === movedItem.id) return
        batch.update(productBacklogRef.doc(item.id), { order: item.order - 1 })
      })
    }

    await batch.commit()
      .catch(error => { throw new Error(error) })
  },

  async updateItem (teamId, itemId, newItem) {
    await db.collection('teams').doc(teamId).collection('productBacklog').doc(itemId).update(newItem)
      .catch(error => { throw new Error(error) })
  },

  async changeSprintItem (teamId, checkedItems, uncheckedItems) {
    const batch = db.batch()
    const productBacklogRef = db.collection('teams').doc(teamId).collection('productBacklog')

    checkedItems.forEach(item => {
      batch.update(productBacklogRef.doc(item.id), {
        isSelectedForSprint: true
      })
    })

    uncheckedItems.forEach(item => {
      batch.update(productBacklogRef.doc(item.id), {
        isSelectedForSprint: false
      })
    })

    await batch.commit().catch(error => { throw new Error(error) })
  },

  async deleteItem (teamId, itemId) {
    await db.collection('teams').doc(teamId).collection('productBacklog').doc(itemId).delete()
      .catch(error => { throw new Error(error) })
  },

  async addTask (teamId, itemId, newTask) {
    const tasksRef = db.collection('teams').doc(teamId).collection('productBacklog').doc(itemId).collection('tasks')
    await tasksRef.add(newTask).catch(error => { throw new Error(error) })
  },

  async moveTask (teamId, itemId, taskId, status) {
    const taskRef = db.collection('teams').doc(teamId).collection('productBacklog').doc(itemId).collection('tasks').doc(taskId)
    await taskRef.update({ status }).catch(error => { throw new Error(error) })
  },

  async getItems (teamId) {
    const itemsRef = db.collection('teams').doc(teamId).collection('productBacklog').orderBy('number', 'desc')
    const results = await itemsRef.get().catch(error => { throw new Error(error) })
    return results
  }
}
