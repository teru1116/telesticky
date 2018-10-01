import firebase from '@/firebase'
const db = firebase.firestore()

export default {
  async updateDisplayName (uid, displayName) {
    try {
      await firebase.auth().currentUser.updateProfile({ displayName })
      await db.collection('users').doc(uid).update({ displayName })
    } catch (error) {
      throw new Error(error)
    }
  },

  async updateProfilePhoto (uid, dataURL) {
    let photoURL = ''

    try {
      // 画像アップロード
      if (dataURL) {
        const ref = firebase.storage().ref().child(`profile/${uid}/small/photo.jpg`)
        await ref.putString(dataURL, 'data_url')
        photoURL = await ref.getDownloadURL()
      }
      // 画像URLをAuthとDatabaseにセット
      const user = firebase.auth().currentUser
      await user.updateProfile({ photoURL })
      await db.collection('users').doc(uid).update({ photoURL })
    } catch (error) {
      throw new Error(error)
    }

    return photoURL
  },

  async updateEmail (uid, email) {
    try {
      await firebase.auth().currentUser.updateEmail(email)
      await db.collection('users').doc(uid).update({ email })
    } catch (error) {
      throw new Error(error)
    }
  },

  async updatePassword (password) {
    await firebase.auth().currentUser.updatePassword(password).catch(error => { throw new Error(error) })
  },

  async delete () {
    try {
      // Auth User削除
      const user = firebase.auth().currentUser
      await user.delete()

      const batch = db.batch()
      const userRef = db.collection('users').doc(user.uid)

      // teamのmembersから削除
      const snapshot = await userRef.collection('teams').get()
      snapshot.forEach(doc => {
        batch.delete(db.collection('scrumTeams').doc(doc.id).collection('members').doc(user.uid))
      })
      db.collection('scrumTeams')

      // user削除
      batch.delete(userRef)
      await batch.commit()
    } catch (error) {
      throw new Error(error)
    }
  }
}
