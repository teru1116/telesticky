import firebase from '../firebase'

const db = firebase.firestore()
const settings = {
  timestampsInSnapshots: true
}
db.settings(settings)

const teamId = location.pathname.split('/')[2]
const teamRef = db.collection('ScrumTeams').doc(teamId)

export default {
  start (params, callback) {
    const newDocRef = teamRef.collection('Sprints').doc()
    const newDocId = newDocRef.id
    const itemsRef = teamRef.collection('Sprints').doc(newDocId).collection('ProductBacklogItems')

    // 一括書き込み開始
    const batch = db.batch()
    batch.set(newDocRef, {
      sprintNumber: params.sprintNumber,
      startDate: params.startDate,
      endDate: params.endDate
    })
    params.items.forEach(item => {
      batch.set(itemsRef.doc(item.id), item)
    })
    batch.update(teamRef, {
      currentSprintId: newDocId
    })

    batch.commit().then(() => {
      callback()
    })
  }
}
