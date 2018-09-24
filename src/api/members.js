import firebase from '@/firebase'
import admin from './admin'

const db = firebase.firestore()

export default {
  getMembers (teamId) {
    return new Promise((resolve, reject) => {
      let members = []
      let count = 0

      db.collection('scrumTeams').doc(teamId).collection('members').get()
        .then(snapshot => {
          count = snapshot.size
          snapshot.forEach(doc => {
            db.collection('users').doc(doc.id).get()
              .then(doc => {
                members.push(Object.assign(doc.data(), { id: doc.id }))
                if (count === members.length) {
                  resolve(members)
                }
              })
              .catch(error => reject(error))
          })
        })
        .catch(error => reject(error))
    })
  },

  async addMember (teamId, email) {
    // Admin APIでemailを元に取得したユーザー情報の配列
    const users = await admin.fetchAuthUsers([email])
    const uid = users[0].uid

    return new Promise((resolve, reject) => {
      if (uid) {
        // すでにサービスに登録済みのユーザーであれば、uidをmembersコレクションに追加する
        db.collection('scrumTeams').doc(teamId).collection('members').doc(uid).set({
          createdDate: firebase.firestore.FieldValue.serverTimestamp()
        })
          .then(() => db.collection('users').doc(uid).get())
          .then(doc => resolve(Object.assign(doc.data(), { id: doc.id })))
          .catch(error => reject(error))
      } else {
        // まだ登録されていないユーザーの場合は、メールリンクで招待する
        firebase.auth().sendSignInLinkToEmail(email, {
          url: `http://localhost:8080/invited?t=${teamId}`,
          handleCodeInApp: true
        })
          .then(() => resolve())
          .catch(error => reject(error))
      }
    })
  }
}
