import firebase from '../firebase'

const db = firebase.firestore()
const settings = {
  timestampsInSnapshots: true
}
db.settings(settings)

const teamId = location.pathname.split('/')[2]
const teamRef = db.collection('ScrumTeams').doc(teamId)

export default {
  get (callback) {
    teamRef.get()
      .then(doc => {
        callback(Object.assign(doc.data(), { id: doc.id }))
      })
  },

  update (param) {
    console.log(param)
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
