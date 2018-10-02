import firebase from '@/firebase'
import admin from './admin'

const db = firebase.firestore()

export default {
  async get (teamId) {
    try {
      // メンバー情報取得クエリ
      // DocumentReferenceの配列を作る
      const userRefs = []
      const snapshot = await db.collection('scrumTeams').doc(teamId).collection('members').get()
      snapshot.forEach(doc => userRefs.push(db.collection('users').doc(doc.id)))
      // 複数の非同期処理の結果を得るために Promise.all() を使用
      const docs = await Promise.all(userRefs.map(async userRef => { return await userRef.get() }))
      return docs.map(doc => Object.assign(doc.data(), { id: doc.id }))
    } catch (error) {
      throw new Error(error)
    }
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
