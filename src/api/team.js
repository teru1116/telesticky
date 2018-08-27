import firebase from '../firebase'

const db = firebase.firestore()
const settings = {
  timestampsInSnapshots: true
}
db.settings(settings)

const teamId = location.pathname.split('/')[2]
const teamRef = teamId ? db.collection('ScrumTeams').doc(teamId) : null

export default {
  get (callback) {
    teamRef.get()
      .then(doc => {
        callback(Object.assign(doc.data(), { id: doc.id }))
      })
  },

  update (param) {
    return new Promise((resolve, reject) => {
      teamRef.update(param)
        .then(() => {
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  }
}
