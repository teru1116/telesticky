import firebase from '@/firebase'
const db = firebase.firestore()

export default {
  async start (teamId, newSprint) {
    const batch = db.batch()
    const teamRef = db.collection('scrumTeams').doc(teamId)
    const newSprintRef = teamRef.collection('sprints').doc()
    const newSprintId = newSprintRef.id

    // sprintドキュメントを新規作成
    const newSprintData = {
      sprintNumber: newSprint.sprintNumber,
      startDate: newSprint.startDate,
      endDate: newSprint.endDate,
      sprintGoal: newSprint.sprintGoal
    }
    batch.set(newSprintRef, newSprintData)

    // スプリントで選択したバックログアイテムのスプリントフラグをON
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

    // 書き込み実行
    await batch.commit().catch(error => { throw new Error(error) })

    // 書き込みが成功したら、Local StorageにスプリントIDを書き込む（ルーティングに使う）
    localStorage.setItem('sid', newSprintId)

    return Object.assign(newSprintData, { id: newSprintId })
  },

  async getActiveSprintId (teamId) {
    const doc = await db.collection('scrumTeams').doc(teamId).get().catch(error => { throw new Error(error) })
    return doc.data().activeSprintId
  },

  async getSprintData (teamId, sprintId) {
    const doc = await db.collection('scrumTeams').doc(teamId).collection('sprints').doc(sprintId).get().catch(error => { throw new Error(error) })
    return Object.assign(doc.data(), { id: doc.id })
  },

  async finish (teamId, sprintId) {
    const batch = db.batch()
    const teamRef = db.collection('scrumTeams').doc(teamId)
    
    // プロダクトバックログアイテムのスプリントフラグをOFF
    const productBacklogRef = teamRef.collection('productBacklog')
    const snapshot = await productBacklogRef.where('isSelectedForSprint', '==', true).get().catch(error => { throw new Error(error) })
    snapshot.forEach(doc => {
      batch.update(productBacklogRef.doc(doc.id), { isSelectedForSprint: false })
    })

    // sprintのcancelDateフィールドに現在日時をセット
    batch.update(teamRef.collection('sprints').doc(sprintId), {
      canceledDate: firebase.firestore.FieldValue.serverTimestamp()
    })

    // teamのactiveSprintIdを削除
    batch.update(teamRef, { activeSprintId: '' })

    // 書き込み実行
    await batch.commit().catch(error => { throw new Error(error) })

    // 書き込みが成功したら、Local Stoageから現在のスプリントIDを削除
    localStorage.removeItem('sid')
  }
}
