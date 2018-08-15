import firebase from '../firebase'

const db = firebase.firestore()
const settings = {
  timestampsInSnapshots: true
}
db.settings(settings)

const teamId = location.pathname.split('/')[2]
const teamRef = db.collection('ScrumTeams').doc(teamId)

export default {
  create (params, callback, errorCallback) {
    teamRef.collection('Sprints').add({
      'sprintNumber': params.sprintNumber,
      'startDate': params.startDate,
      'endDate': params.endDate
    })
    .then(doc => {
      callback(doc.id)
    })
    .catch(error => {
      errorCallback(error)
    })
  }

  setCurrentSprint (sprintId, callback, errorCallback) {
    teamRef.update({
      'CurrentSprint': sprintId
    })
    .then(() => {
      callback()
    })
    .catch(error => {
      errorCallback(error)
    })
  }

  pushItemsIntoSprint (items, sprintId, callback) {
    const batch = db.batch()
    const itemsRef = teamRef.collection('Sprints').doc(sprintId).collection('SprintItems')
    items.forEach(item => {
      batch.set(itemsRef.doc(item.id), item)
    })

    batch.commit().then(() => {
      callback()
    })
  }
}
