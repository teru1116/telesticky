<template>
  <div>
    <input
      v-model="teamName"
      placeholder="チーム名を入力"
    >
    <ul
      v-for="(item, index) in invitingMembers"
      :key="index"
    >
      <li>
        <p>
          {{ item.message }}
        </p>
        <input
          v-model="item.email"
          placeholder="メールアドレスを入力"
        >
        <input
          v-model="item.nickname"
          placeholder="ユーザー名を入力（あとから変更できます）"
        >
        <input
          v-model="item.role"
          placeholder="チームでの役割を入力"
        >
        <button
          @click="removeInput(index)"
        >
          x
        </button>
      </li>
    </ul>
    <button
      @click="addInput"
    >
      +
    </button>
    <button
      @click="onCreateTeamClicked"
    >
      スクラムチーム作成
    </button>
  </div>
</template>

<script>
import firebase from './../firebase'

const db = firebase.firestore()
const settings = {
  timestampsInSnapshots: true
}
db.settings(settings)

export default {
  data: function () {
    return {
      teamName: '',
      invitingMembers: []
    }
  },
  methods: {
    addInput: function () {
      this.invitingMembers.push(
        {
          'email': '',
          'nickname': '',
          'role': '',
          'isSucceed': false,
          'message': ''
        }
      )
    },
    removeInput: function (index) {
      this.invitingMembers.splice(index, 1)
    },
    onCreateTeamClicked: function () {
      // 新規ScrumTeam作成
      db.collection('ScrumTeams').add({
        'teamName': this.teamName,
        'config': {
          'estimationUnit': 'story-points',
          'taskStatusList': ['To Do', 'Doing', 'Done'],
          'itemStatusList': ['Not Ready', 'Ready', 'To Do', 'Doing', 'Done']
        }
      })
        .then(docRef => {
          // 招待したメンバーそれぞれについて
          this.invitingMembers.forEach((member, index) => {
            if (!member.email) return

            let url = 'https://us-central1-web-scrum-board.cloudfunctions.net/getUserByEmail'
            url += `?email=${member.email}`
            // emailを渡してuidを検索するCloud Function
            fetch(url)
              .then(res => res.json())
              .then(response => {
                if (response.uid) {
                  this.addExistingUserToTeam(docRef.id, response.uid, member, index)
                } else {
                  this.inviteMember(docRef.id, member, index)
                }
              })
              .catch(error => {
                console.error(error)
              })
          })
        })
    },
    addExistingUserToTeam: function (teamId, uid, member, index) {
      // ScrumTeamのmembersに登録
      db.collection('ScrumTeams').doc(teamId).collection('members').doc(uid).set({
        'nickname': member.nickname,
        'role': member.role
      })

      // UserのscrumTeamsに追加
      db.collection('Users').doc(uid).collection('teams').doc(teamId).set({
        'teamName': this.teamName,
        'nickname': member.nickname,
        'role': member.role
      })

      // TODO: ScrumTeamに追加されたことを知らせるメールを送信
    },
    inviteMember: function (teamId, member, index) {
      const actionCodeSettings = {
        url: `http://localhost:8080/invited?t=${teamId}&n=${member.nickname}&r=${member.role}`,
        handleCodeInApp: true
      }
      firebase.auth().sendSignInLinkToEmail(member.email, actionCodeSettings)
        .then(() => {
          // 完了UI
          this.invitingMembers[index].isSucceed = true
          this.invitingMembers[index].message = '招待メールが送信されました。参加をお待ちください。'
        })
        .catch(error => {
          // エラーUI
          this.invitingMembers[index].isSucceed = false
          let errorMessage = ''
          if (error.code === 'auth/invalid-email') {
            errorMessage = 'メールアドレスの形式が正しくありません。'
          } else {
            errorMessage = error.message
          }
          this.invitingMembers[index].message = errorMessage
        })
    }
  },
  created: function () {
    for (let i = 0; i < 3; i++) {
      this.addInput()
    }
  }
}
</script>
