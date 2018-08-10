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
          placeholder="メールアドレスを入力して招待"
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

// メールアクションの設定
const actionCodeSettings = {
  url: 'http://localhost:8080/?finishSignUp?cartId=1234',
  handleCodeInApp: true
}

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
          'isSucceed': false,
          'message': ''
        }
      )
    },
    removeInput: function (index) {
      this.invitingMembers.splice(index, 1)
    },
    onCreateTeamClicked: function () {
      // 1. create new ScrumTeams
      // db.collection('ScrumTeams').add({
      //   'teamName': this.teamName,
      //   'config': {
      //     'estimationUnit': 'story points',
      //     'status': ['To Do', 'Doing', 'Done']
      //   }
      // })
      //   .then(docRef => {
      //
      //   })
      this.sendEmail()
    },
    sendEmail: function () {
      this.invitingMembers.forEach((e, i) => {
        if (!e.email) return
        firebase.auth().sendSignInLinkToEmail(e.email, actionCodeSettings)
          .then(() => {
            this.invitingMembers[i].isSucceed = true
            this.invitingMembers[i].message = '招待メールが送信されました。参加をお待ちください。'
          })
          .catch(error => {
            this.invitingMembers[i].isSucceed = false
            let errorMessage = ''
            if (error.code === 'auth/invalid-email') {
              errorMessage = 'メールアドレスの形式が正しくありません。'
            } else {
              errorMessage = error.message
            }
            this.invitingMembers[i].message = errorMessage
          })
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
