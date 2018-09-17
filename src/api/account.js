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
  },

  updateProfilePhoto (teamId, uid, dataURL) {
    return new Promise((resolve, reject) => {
      // 画像アップロード
      const ref = firebase.storage().ref().child(`profile/${uid}/small/photo.jpg`)
      ref.putString(dataURL, 'data_url')
        .then(snapshot => {
          return ref.getDownloadURL()
        })
        .then(url => {
          // Authを更新
          firebase.auth().currentUser.updateProfile({
            photoURL: url
          })

          // Databaseを更新
          const batch = db.batch()
          batch.update(db.collection('users').doc(uid), {
            photoURL: url
          })
          batch.set(db.collection('scrumTeams').doc(teamId).collection('members').doc(uid), {
            photoURL: url
          })
      
          batch.commit()
            .then(() => {
              resolve(url)
            })
            .catch(error => {
              console.error('batch error', error)
              reject(error)
            })
        })
        .catch(error => {
          console.error(error)
        })
    })
  }
}
