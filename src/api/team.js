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
      db.runTransaction(transaction => {
        // 削除するteamに属しているユーザーのuidを取得
        return transaction.get(db.collection('scrumTeam').doc(teamId).collection('members')).then(snapshot => {
          // それぞれのユーザーのteamsコレクションから該当teamを削除
          snapshot.forEach(doc => {
            let uid = doc.id
            transaction.delete(db.collection('users').doc(uid).collection('teams').doc(teamId))
          })
          // team削除
          transaction.delete(db.collection('scrumTeam').doc(teamId))
          return
        })
      })
      .then(() => redolve())
      .catch(error => reject(error))
    })
  }
}
