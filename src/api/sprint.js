import firebase from '@/firebase'
const db = firebase.firestore()

export default {
  async start (teamId, newSprintData) {
    const teamRef = db.collection('scrumTeams').doc(teamId)
    const newSprintRef = teamRef.collection('sprints').doc()
    const newSprintId = newSprintRef.id

    // チームの合計スプリント数に基づいて新しいスプリント番号を書き込めるよう、トランザクションで書き込み処理
    let newSprintNumber = 0
    await db.runTransaction(async transaction => {
      const doc = await transaction.get(teamRef).catch(error => { throw new Error(error) })
      const data = doc.data()
      // 新しいスプリント番号を算出
      newSprintNumber = data.totalSprintCount + 1

      // sprintドキュメントを新規作成
      transaction.set(newSprintRef, {
        sprintNumber: newSprintNumber,
        startDate: newSprintData.startDate,
        endDate: newSprintData.endDate,
        sprintGoal: newSprintData.sprintGoal
      })

      // スプリントで選択したバックログアイテムのスプリントフラグをON
      newSprintData.items.forEach(item => {
        transaction.update(teamRef.collection('productBacklog').doc(item.id), {
          isSelectedForSprint: true
        })
      })

      // teamドキュメントを更新
      transaction.update(teamRef, {
        activeSprintId: newSprintId,
        totalSprintCount: newSprintNumber
      })
    }).catch(error => { throw new Error(error) })

    // 書き込みが成功したら、Local StorageにスプリントIDを書き込む（ルーティングに使う）
    localStorage.setItem('sid', newSprintId)

    return Object.assign(newSprintData, {
      id: newSprintId,
      sprintNumber: newSprintNumber
    })
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
