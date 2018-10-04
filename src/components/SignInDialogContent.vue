<template>
  <div>
    <md-dialog-title>{{ title }}</md-dialog-title>
    <md-dialog-content>
      <p>{{ description }}</p>
      <ul>
        <li>
          <input
            v-model="email"
            type="text"
          />
        </li>
        <li>
          <input
            v-model="password"
            type="password"
          />
        </li>
      </ul>
      <p>{{ errorMessage }}</p>
    </md-dialog-content>
    <md-dialog-actions>
      <md-button
        class="md-raised"
        @click="$emit('close')"
      >
        キャンセル
      </md-button>
      <md-button
        class="md-raised md-primary primary-button"
        @click="reauth"
      >
        続行する
      </md-button>
    </md-dialog-actions>

    <!-- インジケータ -->
    <md-progress-spinner
      v-if="showsIndicator"
      md-mode="indeterminate"
    />
  </div>
</template>

<script>
import firebase from '@/firebase'

export default {
  props: {
    uid: String,
    title: String,
    reauthNext: String
  },
  computed: {
    description () {
      switch (this.reauthNext) {
        case 'updateEmail': return 'メールアドレスを変更するためには、再度認証が必要です。'
        case 'updatePassword': return 'パスワードを変更するためには、再度認証が必要です。'
        case 'deleteAccount': return '退会するためには、再度認証が必要です。'
        default: return ''
      }
    }
  },
  data () {
    return {
      email: '',
      password: '',
      errorMessage: '',
      showsIndicator: false
    }
  },
  methods: {
    reauth () {
      const user = firebase.auth().currentUser
      const credential = firebase.auth.EmailAuthProvider.credential(this.email, this.password)

      this.showsIndicator = true

      user.reauthenticateAndRetrieveDataWithCredential(credential)
        .then(() => {
          this[this.reauthNext]()
        })
        .catch(error => {
          // TODO: エラー文言を表示する
          this.errorMessage = error.message
          console.error(error)
        })
        .finally(() => {
          this.showsIndicator = false
        })
    },
    updateEmail () {
      this.$store.dispatch('updateEmail', {
        uid: this.uid,
        email: this.email
      })
        .then(() => {
          this.$emit('reauthNextSucceeded')
        })
        .catch(error => {
          this.errorMessage = error.message
          console.error(error)
        })
        .finally(() => {
          this.showsIndicator = false
        })
    },
    updatePassword () {
      this.$store.dispatch('updatePassword', this.password)
        .then(() => {
          this.$emit('reauthNextSucceeded')
        })
        .catch(error => {
          this.errorMessage = error.message
          console.error(error)
        })
        .finally(() => {
          this.showsIndicator = false
        })
    },
    deleteAccount () {
      this.$store.dispatch('deleteAccount')
        .then(() => {
          this.$emit('reauthNextSucceeded')
        })
        .catch(error => {
          //
          console.error(error)
        })
        .finally(() => {
          this.showsIndicator = false
        })
    }
  }
}
</script>
