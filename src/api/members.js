import firebase from '@/firebase'

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
  }
}
