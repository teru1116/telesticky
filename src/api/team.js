import firebase from '@/firebase'
const db = firebase.firestore()
// これを書かないとwarningが出る
db.settings({ timestampsInSnapshots: true })

export default {
  async get (teamId) {
    const doc = await db.collection('scrumTeams').doc(teamId).get().catch(error => { throw new Error(error) })
    return Object.assign(doc.data(), { id: doc.id })
  },

  async update (teamId, param) {
    await db.collection('scrumTeams').doc(teamId).update(param).catch(error => { throw new Error(error) })
  },

  async delete (teamId) {
    try {
      // 削除対象のteamのmembersのuidを取得
      const snapshot = await db.collection('scrumTeams').doc(teamId).collection('members').get()
      // それぞれのユーザーのteamsコレクションから、このteamを削除
      snapshot.forEach(async doc => {
        await db.collection('users').doc(doc.id).collection('teams').doc(teamId).delete()
      })
      // teamを削除
      db.collection('scrumTeams').doc(teamId).delete()
    } catch (error) {
      throw new Error(error)
    }
  }
}
