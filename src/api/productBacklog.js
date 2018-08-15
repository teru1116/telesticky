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
    })
  }
}
