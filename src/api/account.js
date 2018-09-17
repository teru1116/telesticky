import firebase from '@/firebase'

const db = firebase.firestore()

export default {
  updateDisplayName (teamId, uid, displayName) {
    // Authを更新
    firebase.auth().currentUser.updateProfile({
      displayName: displayName
    })

    // Databaseを更新
    const batch = db.batch()
    batch.update(db.collection('users').doc(uid), {
      displayName: displayName
    })
    batch.update(db.collection('scrumTeams').doc(teamId).collection('members').doc(uid), {
      displayName: displayName
    })

    return new Promise((resolve, reject) => {
      batch.commit()
        .then(() => {
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  }
}
