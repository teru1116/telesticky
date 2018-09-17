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
            :defaultPhotoURL="account.photoURL"
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
        この内容で更新する
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
    account: Object,
    team: Object
  },
  data () {
    return {
      displayName: this.account.displayName,
      photoURL: this.account.photoURL,
      dataURL: ''
    }
  },
  methods: {
    ...mapActions([
      'updateDisplayName',
      'updateProfilePhoto'
    ]),
    onPhotoChange (dataURL) {
      this.dataURL = dataURL
    },
    submit () {
      this.updateDisplayName({
        teamId: this.team.id,
        uid: this.account.uid,
        displayName: this.displayName
      })
      this.updateProfilePhoto({
        teamId: this.team.id,
        uid: this.account.uid,
        dataURL: this.dataURL
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
