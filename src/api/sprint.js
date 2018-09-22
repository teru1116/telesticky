import firebase from '@/firebase'

const db = firebase.firestore()
const settings = {
  timestampsInSnapshots: true
}
db.settings(settings)

export default {
  getActiveSprintId (teamId) {
    return new Promise((resolve, reject) => {
      db.collection('scrumTeams').doc(teamId).get().then(doc => {
        resolve(doc.data().activeSprintId)
      })
    })
  },

  // NOTE: listenはPromiseではリアクティブ更新がされなかったため、callback方式に差し替え
  listenSprint (teamId, sprintId, callback) {
    db.collection('scrumTeams').doc(teamId).collection('sprints').doc(sprintId).onSnapshot(doc => {
      callback(doc.data())
    })
  },

  createAndStartSprint (teamId, newSprint) {
    const teamRef = db.collection('scrumTeams').doc(teamId)

    const newSprintRef = teamRef.collection('sprints').doc()
    const newSprintId = newSprintRef.id

    // 一括書き込み開始
    const batch = db.batch()

    // SprintsコレクションにDocを新規追加
    batch.set(newSprintRef, {
      sprintNumber: newSprint.sprintNumber,
      startDate: newSprint.startDate,
      endDate: newSprint.endDate,
      sprintGoal: newSprint.sprintGoal
    })

    // 選択したProductBacklogItemのスプリントフラグを更新
    newSprint.items.forEach(item => {
      batch.update(db.collection('scrumTeams').doc(teamId).collection('productBacklog').doc(item.id), {
        isSelectedForSprint: true
      })
    })

    // teamドキュメントを更新
    batch.update(teamRef, {
      activeSprintId: newSprintId,
      totalSprintCount: newSprint.sprintNumber
    })

    // commit
    return new Promise((resolve, reject) => {
      batch.commit().then(() => {
        resolve(newSprintId)
      })
    })
  }
}
