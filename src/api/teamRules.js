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
        callback(Object.assign(doc.data().config, { id: doc.id }))
      })
  }
}
