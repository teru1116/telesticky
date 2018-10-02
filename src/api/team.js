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
      const userTeamRefs = []
      snapshot.forEach(doc => {
        userTeamRefs.push(db.collection('users').doc(doc.id).collection('teams').doc(teamId))
      })
      await Promise.all(userTeamRefs.map(async docRef => {
        const promise = await docRef.delete()
        return promise
      }))
      // teamを削除
      db.collection('scrumTeams').doc(teamId).delete()
    } catch (error) {
      throw new Error(error)
    }
  }
}
