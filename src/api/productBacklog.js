import firebase from '../firebase'

const db = firebase.firestore()
const settings = {
  timestampsInSnapshots: true
}
db.settings(settings)

const teamId = location.pathname.split('/')[2]
const teamRef = db.collection('ScrumTeams').doc(teamId)
const pblRef = teamRef.collection('ProductBacklog')

export default {
  listen (callback) {
    pblRef.orderBy('order')
    // pblRef.where('status', '==', 'sprint').where('status', '==', 'todo').orderBy('order')
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

  add (newItem, callback, errorCallback) {
    return db.runTransaction(transaction => {
      return transaction.get(teamRef).then(doc => {
        const data = doc.data()
        const newCount = data.totalItemCount + 1
        const newItemRef = pblRef.doc()
        transaction.set(newItemRef, Object.assign(newItem, {
          status: 'todo',
          number: newCount,
          order: newCount
        }))
        transaction.update(teamRef, { totalItemCount: newCount })
      })
    }).then(() => {
      callback()
    }).catch(error => {
      errorCallback(error)
    })
  },

  move (movedItem, newIndex, isRaised, relatedItems) {
    teamRef.get()
      .then(doc => {
        // 過去のアイテムの合計数
        const doneItemCount = doc.data().doneItemCount
        // 動かしたアイテムのorderを更新
        pblRef.doc(movedItem.id).update({ order: newIndex + doneItemCount + 1 })
        // order値を下げた場合
        if (isRaised) {
          // 影響を受けたアイテムのorderを更新
          relatedItems.forEach((item, index) => {
            if (item.id === movedItem.id) return
            pblRef.doc(item.id).update({ order: item.order + 1 })
          })
        }
        // order値を上げた場合
        if (!isRaised) {
          // 影響を受けたアイテムのorderを更新
          relatedItems.forEach((item, index) => {
            if (item.id === movedItem.id) return
            pblRef.doc(item.id).update({ order: item.order - 1 })
          })
        }
      })
  }
}
