import firebase from './../firebase'

const db = firebase.firestore()

export default {
  getTeams (uid) {
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

  createTeam (uid, team) {
    let batch = db.batch()

    const newTeamRef = db.collection('scrumTeams').doc()
    const newUserTeamRef = db.collection('users').doc(uid).collection('teams').doc(newTeamRef.id)

    // firestore /teams/{teamId} にチームの初期情報をセット
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

    // firestore /users/{uid}/teams/{teamId} にチームの初期情報をセット
    batch.set(newUserTeamRef, {
      name: team.teamName,
      sprintNumber: 0,
      restOfItem: 0,
      restOfPoint: 0
    })

    return new Promise((resolve, reject) => {
      // member.emailを渡して、Authenticationからユーザー情報を取得するAPI
      const url = 'http://localhost:5000/web-scrum-board/us-central1/getUsersWithEmails'
      // const url = 'https://us-central1-web-scrum-board.cloudfunctions.net/getUsersWithEmails'
      fetch(url, {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json'
        }),
        body: JSON.stringify({
          members: team.members
        }),
        mode: 'cors'
      })
        .then(res => res.json())
        .then(response => {
          response.forEach(member => {
            // Authenticationに存在しないemailであれば、メールリンクを送信する
            if (!member.uid) {
              firebase.auth().sendSignInLinkToEmail(member.email, {
                url: `http://localhost:8080/invited?t=${newTeamRef.id}&n=${member.displayName}&r=${member.role}`,
                handleCodeInApp: true
              })
            // Authenticationに存在するemailであれば、そのuidで /teams/{teamId}/members/{uid} にセットする
            } else {
              batch.set(newTeamRef.collection('members').doc(member.uid), {
                email: member.email,
                displayName: member.displayName,
                photoURL: member.photoURL
              })
              // TODO: onAddをトリガーに、新しくチームのmemberに追加されたことを通知するCloud Functions
            }
          })

          // firestore書き込み実行
          return batch.commit()
        })
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
          reject(error)
        })
    })
  }
}
