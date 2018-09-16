import firebase from '@/firebase'

const db = firebase.firestore()

export default {
  getMembers (teamId) {
    return new Promise((resolve, reject) => {
      let members = []
      db.collection('scrumTeams').doc(teamId).collection('members').get()
        .then(snapshot => {
          snapshot.forEach(doc => {
            members.push(Object.assign(doc.data(), { id: doc.id }))
          })
          resolve(members)
        })
        .catch(error => reject(error))
    })
  }
}
