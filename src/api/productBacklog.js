import firebase from '../firebase'

const db = firebase.firestore()
const settings = {
  timestampsInSnapshots: true
}
db.settings(settings)

const teamId = location.pathname.split('/')[2]
const pblRef = db.collection('ScrumTeams').doc(teamId).collection('ProductBacklog')

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
    pblRef.add(newItem)
      .then(doc => {
        callback(Object.assign(doc.data(), {id: doc.id}))
      })
      .catch(error => {
        errorCallback(error)
      })
  }
}
