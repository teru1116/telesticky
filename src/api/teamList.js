import firebase from '@/firebase'
import admin from './admin'

const db = firebase.firestore()

export default {
  getTeamList (uid) {
    return new Promise((resolve, reject) => {
      let results = []
      db.collection('users').doc(uid).collection('teams').get()
        .then(snapshot => {
          snapshot.forEach(doc => {
            results.push(Object.assign(doc.data(), { id: doc.id }))
          })
          resolve(results)
        })
        .catch(error => reject(error))
    })
  },

  async createTeam (uid, team) {
    const batch = db.batch()

    const newTeamRef = db.collection('scrumTeams').doc()
    const newUserTeamRef = db.collection('users').doc(uid).collection('teams').doc(newTeamRef.id)

    // team作成
    batch.set(newTeamRef, {
      name: team.teamName,
      sprintDuration: team.sprintDuration,
      definitionsOfDone: [],
      estimationUnit: 'Points',
      itemStatusList: ['ToDo', 'Doing', 'Done'],
      initialItemStatus: 0,
      initialSprintItemStatus: 0,
      taskStatusList: ['Todo', 'Doing', 'Done'],
      activeSprintId: '',
      totalSprintCount: 0,
      totalItemCount: 0,
      doneItemCount: 0
    })

    // teamのmembersコレクションに自身のuidを追加
    batch.set(newTeamRef.collection('members').doc(uid), {
      createdDate: firebase.firestore.FieldValue.serverTimestamp()
    })

    // userのteamsコレクションに追加
    batch.set(newUserTeamRef, {
      name: team.teamName,
      sprintNumber: 0,
      restOfItem: 0,
      restOfPoint: 0
    })

    // メンバー招待処理
    if (team.members.length) {
      const users = await admin.fetchAuthUsers(team.members)
      users.forEach(user => {
        // uidが存在しない場合は、メールリンクで招待する
        if (!user.uid) {
          firebase.auth().sendSignInLinkToEmail(user.email, {
            url: `http://localhost:8080/invited?t=${newTeamRef.id}&n=${user.displayName}`,
            handleCodeInApp: true
          })
        // uidが存在する場合は、uidを当該teamのmembersコレクションに追加する
        } else {
          batch.set(newTeamRef.collection('members').doc(user.uid), {
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL
          })
        // TODO: onAddをトリガーに、新しくチームのmemberに追加されたことを通知するCloud Functions
        }
      })
    }

    return new Promise((resolve, reject) => {
      batch.commit()
        .then(() => {
          // 自分の所属チームリストを取得して返す
          return db.collection('users').doc(uid).collection('teams').get()
        })
        .then(snapshot => {
          let results = []
          snapshot.forEach(doc => {
            results.push(Object.assign(doc.data(), { id: doc.id }))
          })
          resolve(results)
        })
        .catch(error => {
          console.error(error)
          reject(error)
        })
    })
  }
}
