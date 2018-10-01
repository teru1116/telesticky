import firebase from '@/firebase'
import admin from './admin'

const db = firebase.firestore()

export default {
  async get (teamId) {
    const members = []

    try {
      const snapshot = await db.collection('scrumTeams').doc(teamId).collection('members').get()
      snapshot.forEach(async teamMemberDoc => {
        let userDoc = await db.collection('users').doc(teamMemberDoc.id).get()
        members.push(Object.assign(userDoc.data(), { id: userDoc.id }))
      })
    } catch (error) {
      throw new Error(error)
    }

    return members
  },

  async addMember (teamId, email) {
    try {
      // Admin APIでemailを元に取得したユーザー情報の配列
      const users = await admin.fetchAuthUsers([email])
      const uid = users[0].uid

      if (uid) {
        // すでにサービスに登録済みのユーザーであれば、uidをmembersコレクションに追加する
        await db.collection('scrumTeams').doc(teamId).collection('members').doc(uid).set({
          createdDate: firebase.firestore.FieldValue.serverTimestamp()
        })
        const doc = await db.collection('users').doc(uid).get()
        return Object.assign(doc.data(), { id: doc.id })
      } else {
        // まだ登録されていないユーザーの場合は、メールリンクで招待する
        await firebase.auth().sendSignInLinkToEmail(email, {
          url: `http://localhost:8080/invited?t=${teamId}`,
          handleCodeInApp: true
        })
      }
    } catch (error) {
      throw new Error(error)
    }
  }
}
