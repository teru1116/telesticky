<template>
  <div
    class="inner"
  >
    <!-- header -->
    <div
      class="content-header"
    >
      <h2>
        アカウント設定
      </h2>
      <div
        class="header-items"
      >
      </div>
    </div>

    <!-- settings -->
    <div class="main-content-container">
      <ul
        class="form-items"
      >
        <li>
          <h3>プロフィール画像</h3>
          <ProfileImageUploader
            :width="200"
            :height="200"
            :defaultPhotoURL="authUser.photoURL"
            v-on:change="onPhotoChange"
          />
        </li>
        <li>
          <h3>ユーザー名</h3>
          <input
            v-model="displayName"
            type="text"
          >
        </li>
      </ul>

      <md-button
        class="md-raised md-primary primary-button"
        @click="submit"
      >
        設定を更新する
      </md-button>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import firebase from '@/firebase'
// components
import ProfileImageUploader from './ProfileImageUploader'

export default {
  props: {
    authUser: Object,
    team: Object
  },
  data () {
    return {
      displayName: this.authUser.displayName,
      photoURL: this.authUser.photoURL,
      dataURL: ''
    }
  },
  methods: {
    ...mapActions([
      'updateDisplayName'
    ]),
    onPhotoChange (dataURL) {
      this.dataURL = dataURL
    },
    submit () {
      // ユーザー名更新
      this.updateDisplayName({
        teamId: this.team.id,
        uid: this.authUser.uid,
        displayName: this.displayName
      }),
      firebase.auth().currentUser.updateProfile({
        displayName: this.displayName
      })
      // プロフィール画像アップロード
      const ref = firebase.storage().ref().child(`profile/${this.authUser.uid}/small/photo.jpg`)
      ref.putString(this.dataURL, 'data_url')
        .then(snapshot => {
          return ref.getDownloadURL()
        })
        .then(url => {
          // Authを更新
          firebase.auth().currentUser.updateProfile({
            photoURL: url
          })
          // Databaseを更新
          db.collection('scrumTeams').doc(teamId).collection('members').doc(uid).update()
          db.collection('users').doc(uid).update()
        })
        .catch(error => {
          console.error(error)
        })
    }
  },
  components: {
    ProfileImageUploader
  }
}
</script>

<style lang="scss" scoped>
.main-content-container {
  padding: 16px 0;
  ul.form-items {
    margin-bottom: 64px;
    li {
      input {
        &.large {
          width: 100%;
        }
      }
      .md-button {
        background-color: rgba(0, 0, 0, 0);
      }
    }
  }
}
</style>
