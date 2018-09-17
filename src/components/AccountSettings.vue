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
import ProfileImageUploader from './ProfileImageUploader'

export default {
  props: {
    authUser: Object
  },
  data () {
    return {
      displayName: this.authUser.displayName,
      photoURL: this.authUser.photoURL
    }
  },
  methods: {
    submit () {
      this.authUser.updateProfile({
        displayName: this.displayName
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
