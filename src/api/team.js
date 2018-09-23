import firebase from '@/firebase'

const db = firebase.firestore()
const settings = {
  timestampsInSnapshots: true
}
db.settings(settings)

export default {
  get (teamId, callback) {
    db.collection('scrumTeams').doc(teamId).get()
      .then(doc => {
        callback(Object.assign(doc.data(), { id: doc.id }))
      })
  },

  update (teamId, param) {
    return new Promise((resolve, reject) => {
      db.collection('scrumTeams').doc(teamId).update(param)
        .then(() => resolve())
        .catch(error => reject(error))
    })
  },

  delete (teamId) {
    return new Promise((resolve, reject) => {
      // 削除対象のteamのmembersのuidを取得
      db.collection('scrumTeams').doc(teamId).collection('members').get()
        .then(snapshot => {
          // それぞれのユーザーのteamsコレクションから、このteamを削除
          snapshot.forEach(doc => {
            let uid = doc.id
            // NOTE: 完了時の処理は特に書いていない
            db.collection('users').doc(uid).collection('teams').doc(teamId).delete()
              .catch(error => console.error(error))
          })
          // teamを削除
          db.collection('scrumTeams').doc(teamId).delete()
            .then(() => resolve())
            .catch(error => reject(error))
        })
    })
  }
}
