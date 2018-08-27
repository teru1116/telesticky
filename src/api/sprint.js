import firebase from '../firebase'

const db = firebase.firestore()
const settings = {
  timestampsInSnapshots: true
}
db.settings(settings)

const teamId = location.pathname.split('/')[2]
const teamRef = teamId ? db.collection('ScrumTeams').doc(teamId) : null
const pbRef = teamId ? teamRef.collection('ProductBacklog') : null

export default {
  getActiveSprintId () {
    return new Promise((resolve, reject) => {
      teamRef.get().then(doc => {
        resolve(doc.data().activeSprintId)
      })
    })
  },

  // NOTE: listenはPromiseではリアクティブ更新がされなかったため、callback方式に差し替え
  listenSprint (sprintId, callback) {
    const sprintRef = teamRef.collection('Sprints').doc(sprintId)

    // listen Sprints/{activeSprint}
    sprintRef.onSnapshot(doc => {
      callback(doc.data())
    })
  },

  createAndStartSprint (payload) {
    const newSprintRef = teamRef.collection('Sprints').doc()
    const newSprintId = newSprintRef.id

    // 一括書き込み開始
    const batch = db.batch()

    // SprintsコレクションにDocを新規追加
    batch.set(newSprintRef, {
      sprintNumber: payload.sprintNumber,
      startDate: payload.startDate,
      endDate: payload.endDate,
      sprintGoal: payload.sprintGoal
    })

    // 選択したProductBacklogItemのスプリントフラグを更新
    payload.items.forEach(item => {
      batch.update(pbRef.doc(item.id), { isSelectedForSprint: true })
    })

    // teamドキュメントを更新
    batch.update(teamRef, {
      activeSprintId: newSprintId,
      totalSprintCount: payload.sprintNumber
    })

    // commit
    return new Promise((resolve, reject) => {
      batch.commit().then(() => {
        resolve()
      })
    })
  }
}
