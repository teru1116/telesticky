import firebase from '@/firebase'

const db = firebase.firestore()
const settings = {
  timestampsInSnapshots: true
}
db.settings(settings)

export default {
  get (teamId, callback) {
    db.collection('scrumTeams').doc(teamId).get()
      .then(doc => {
        callback(Object.assign(doc.data(), { id: doc.id }))
      })
  },

  update (teamId, param) {
    return new Promise((resolve, reject) => {
      db.collection('scrumTeams').doc(teamId).update(param)
        .then(() => {
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  }
}
