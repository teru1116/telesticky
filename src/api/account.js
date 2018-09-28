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
    try {
      // 画像アップロード
      const ref = firebase.storage().ref().child(`profile/${uid}/small/photo.jpg`)
      await ref.putString(dataURL, 'data_url')
      // 画像URLをAuthとDatabaseにセット
      const photoURL = await ref.getDownloadURL()
      await firebase.auth().currentUser.updateProfile({ photoURL })
      await db.collection('users').doc(uid).update({ photoURL })
    } catch (error) {
      throw new Error(error)
    }   
  }
}
