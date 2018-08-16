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
        callback(doc.data().activeSprintData)
      })
  },

  create (params) {
    const newDocRef = teamRef.collection('Sprints').doc()
    const newDocId = newDocRef.id
    const itemsRef = teamRef.collection('Sprints').doc(newDocId).collection('ProductBacklogItems')

    // 一括書き込み開始
    const batch = db.batch()
    // SprintsコレクションにDocを新規追加
    batch.set(newDocRef, {
      sprintNumber: params.sprintNumber,
      sprintGoal: params.sprintGoal,
      startDate: params.startDate,
      endDate: params.endDate
    })
    // SprintsコレクションのDocにitemsコレクションを作成
    params.items.forEach(item => {
      batch.set(itemsRef.doc(item.id), item)
    })
    // teamのDocのactiveSprintDataを更新
    const activeSprintData = {
      id: newDocId,
      sprintNumber: params.sprintNumber,
      sprintGoal: params.sprintGoal,
      startDate: params.startDate,
      endDate: params.endDate,
      items: params.items
    }
    batch.update(teamRef, {
      activeSprintData: activeSprintData
    })
    // commit
    return new Promise((resolve, reject) => {
      batch.commit().then(() => {
        resolve(activeSprintData)
      })
    })
  }
}
