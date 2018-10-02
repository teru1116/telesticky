import firebase from '@/firebase'
import admin from './admin'

const db = firebase.firestore()

export default {
  async get (uid) {
    const results = []

    const snapshot = await db.collection('users').doc(uid).collection('teams').get().catch(error => { throw new Error(error) })
    snapshot.forEach(doc => {
      results.push(Object.assign(doc.data(), { id: doc.id }))
    })

    return results
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

    try {
      // 新しいteamに関連する書き込みを実行
      await batch.commit()

      // 自分の所属チームリストを返す
      const results = []

      const snapshot = await db.collection('users').doc(uid).collection('teams').get()
      snapshot.forEach(doc => {
        results.push(Object.assign(doc.data(), { id: doc.id }))
      })

      return results
    } catch (error) {
      throw new Error(error)
    }
  }
}
