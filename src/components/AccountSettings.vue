<template>
  <div class="inner">
    <!-- header -->
    <div class="content-header">
      <h2>アカウント設定</h2>
    </div>

    <!-- body -->
    <div class="main-content-container">
      <ul class="account-form-items">

        <!-- プロフィール画像 -->
        <li>
          <h3>プロフィール画像</h3>
          <div class="input-column">
            <ProfileImageUploader
              :width="160"
              :height="160"
              :defaultPhotoURL="account.photoURL"
              v-on:change="onPhotoChange"
              ref="profileImageUploader"
            />
          </div>
          <div class="action-column">
            <ul>
              <li class="inputfile-row">
                <p>画像ファイルを選択する</p>
                <input
                  type="file"
                  accept="image/png, image/jpeg"
                  :style="{ display: 'none' }"
                  @change="onFileSelect"
                  ref="photoInput"
                />
                <div class="dummy-inputfile">
                  <md-button
                    class="md-raised"
                    @click="$refs.photoInput.click()"
                  >
                    ファイルを選択
                  </md-button>
                  <span class="show-filename">{{ fileName.length ? fileName : '未選択' }}</span>
                </div>
              </li>
              <li class="submit-row">
                <md-button
                  class="md-raised"
                  @click="removePhoto"
                >
                  削除する
                </md-button>
                <md-button
                  class="md-raised md-primary primary-button"
                  @click="updatePhoto"
                >
                  更新する
                </md-button>
              </li>
            </ul>
          </div>
        </li>

        <!-- ユーザー名 -->
        <li>
          <h3>ユーザー名</h3>
          <div class="input-column">
            <input
              v-model="displayName"
              type="text"
            >
          </div>
          <div class="action-column">
            <md-button
              class="md-raised md-primary primary-button"
              @click="updateDisplayName"
            >
              更新する
            </md-button>
          </div>
        </li>

        <!-- メールアドレス -->
        <li>
          <h3>メールアドレス</h3>
          <div class="input-column">
            <input
              v-model="email"
              type="text"
            >
          </div>
          <div class="action-column">
            <md-button
              class="md-raised md-primary primary-button"
              @click="updateEmail"
            >
              更新する
            </md-button>
          </div>
        </li>

        <!-- パスワード -->
        <li>
          <h3>パスワード</h3>
          <div class="input-column">
            <input
              v-model="password"
              type="password"
            >
          </div>
          <div class="action-column">
            <md-button
              class="md-raised md-primary primary-button"
              @click="updatePassword"
            >
              更新する
            </md-button>
          </div>
        </li>

        <!-- 退会 -->
        <li>
          <h3>その他</h3>
          <div class="input-column">
            <md-button
              class="md-raised"
              @click="deleteAccount"
            >
              退会する
            </md-button>
          </div>
        </li>
      </ul>
    </div>

    <!-- 再認証ダイアログ -->
    <md-dialog
      :md-active.sync="showDialogReauth"
    >
      <SignInDialogContent
        title="認証が必要です"
        :uid="this.account.uid"
        :reauthNext="reauthNext"
        v-on:close="showDialogReauth = false"
        v-on:reauthNextSucceeded="onReauthNextSucceeded"
      />
    </md-dialog>

    <!-- インジケータ -->
    <md-progress-spinner
      v-if="showsIndicator"
      md-mode="indeterminate"
    />

    <!-- トースト -->
    <md-snackbar
      :md-position="'center'"
      :md-duration="4000"
      :md-active.sync="showsSnackbar"
      md-persistent
    >
      <span>{{ snackbarMessage }}</span>
    </md-snackbar>
  </div>
</template>

<script>
import ProfileImageUploader from './ProfileImageUploader'
import SignInDialogContent from './SignInDialogContent'

export default {
  props: {
    account: Object,
    team: Object
  },
  data () {
    return {
      fileName: '',
      dataURL: '',
      photoURL: this.account.photoURL,
      displayName: this.account.displayName,
      email: this.account.email,
      password: '',
      showsIndicator: false,
      showsSnackbar: false,
      snackbarMessage: '',
      showDialogReauth: false,
      reauthNext: ''
    }
  },
  methods: {
    onFileSelect (e) {
      const fileName = e.target.files[0].name
      this.fileName = fileName
      this.$refs.profileImageUploader.onFileSelect(e)
    },
    onPhotoChange (dataURL, fileName) {
      this.dataURL = dataURL
      this.fileName = fileName
    },
    updatePhoto () {
      this.showsIndicator = true

      this.$store.dispatch('updateProfilePhoto', {
        uid: this.account.uid,
        dataURL: this.dataURL
      })
        .then(() => {
          this.showSnackbar('プロフィール写真を変更しました。')
        })
        .catch(error => {
          this.showSnackbar('エラー: プロフィール写真の変更に失敗しました。')
          console.error(error)
        })
        .finally(() => {
          this.showsIndicator = false
        })
    },
    removePhoto () {
      this.showsIndicator = true

      this.$store.dispatch('updateProfilePhoto', {
        uid: this.account.uid,
        dataURL: ''
      })
        .then(() => {
          this.dataURL = ''
          this.showSnackbar('プロフィール写真を削除しました。')
        })
        .catch(error => {
          this.showSnackbar('エラー: プロフィール写真の削除に失敗しました。')
          console.error(error)
        })
        .finally(() => {
          this.showsIndicator = false
        })
    },
    updateDisplayName () {
      this.showsIndicator = true

      this.$store.dispatch('updateDisplayName', {
        uid: this.account.uid,
        displayName: this.displayName
      })
        .then(() => {
          this.showSnackbar('ユーザ名を変更しました。')
        })
        .catch(error => {
          this.showSnackbar('エラー: ユーザー名の変更に失敗しました。')
          console.error(error)
        })
        .finally(() => {
          this.showsIndicator = false
        })
    },
    updateEmail () {
      this.showsIndicator = true

      this.$store.dispatch('updateEmail', {
        uid: this.account.uid,
        email: this.email
      })
        .then(() => {
          this.showSnackbar('メールアドレスを変更しました。')
        })
        .catch(error => {
          // 再認証が要求された場合
          if (error.code === 'auth/requires-recent-login') {
            this.reauthNext = 'updateEmail'
            this.showDialogReauth = true
          } else {
            this.showSnackbar('エラー: メールアドレスの変更に失敗しました。')
          }
          console.error(error)
        })
        .finally(() => {
          this.showsIndicator = false
        })
    },
    updatePassword () {
      this.showsIndicator = true

      this.$store.dispatch('updatePassword', this.password)
        .then(() => {
          this.showSnackbar('パスワードを変更しました。')
        })
        .catch(error => {
          // 再認証が要求された場合
          if (error.code === 'auth/requires-recent-login') {
            this.reauthNext = 'updatePassword'
            this.showDialogReauth = true
          } else {
            this.showSnackbar('エラー: パスワードの変更に失敗しました。')
          }
          console.error(error)
        })
        .finally(() => {
          this.showsIndicator = false
        })
    },
    deleteAccount () {
      this.showsIndicator = true

      this.$store.dispatch('deleteAccount')
        .then(() => {
          this.$router.push('/visitor')
        })
        .catch(error => {
          // 再認証が要求された場合
          if (error.code === 'auth/requires-recent-login') {
            this.reauthNext = 'deleteAccount'
            this.showDialogReauth = true
          } else {
            this.showSnackbar('エラー: 退会できませんでした。')
          }
          console.error(error)
        })
        .finally(() => {
          this.showsIndicator = false
        })
    },
    onReauthNextSucceeded () {
      this.showDialogReauth = false

      switch (this.reauthNext) {
        case 'updateEmail':
          this.showSnackbar('メールアドレスを変更しました。')
          break
        case 'updatePassword':
          this.showSnackbar('パスワードを変更しました。')
          break
        case 'deleteAccount':
          this.$router.push('/visitor')
          break
      }
    },
    showSnackbar (message) {
      this.showsSnackbar = true
      this.snackbarMessage = message
    }
  },
  components: {
    ProfileImageUploader,
    SignInDialogContent
  }
}
</script>

<style lang="scss" scoped>
.main-content-container {
  padding: 40px 0;
  ul.account-form-items {
    > li {
      display: flex;
      padding: 8px 0 24px;
      border-bottom: 1px solid #d5d5d5;
      &:last-child {
        border: 0;
      }
      h3 {
        width: 240px;
        color: #666;
        font-weight: 600;
      }
      .input-column {
        width: 400px;
        padding: 0 16px;
        input[type=text], input[type=password] {
          width: 100%;
          height: 37px;
        }
      }
      .action-column {
        flex: 1;
        ul {
          li {
            border-bottom: 1px solid #d5d5d5;
            &.inputfile-row {
              height: 100px;
              .dummy-inputfile {
                margin: 8px 0;
                .show-filename {
                  line-height: 36px;
                  margin-left: 8px;
                  width: 200px;
                  display: inline-block;
                }
              }
            }
            &.submit-row {
              padding: 8px 0;
              .md-button {
                margin-right: 8px;
              }
            }
            &:last-child {
              border: 0;
            }
          }
        }
      }
    }
  }
}
</style>
