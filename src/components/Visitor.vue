<template>
  <div>
    <!-- ヘッダー -->
    <header>
      <div class="inner">
        <h1>サービスロゴ</h1>
        <md-button
          class="md-raised"
          @click="$router.push('/sign_in')"
        >
          サインイン
        </md-button>
      </div>
    </header>
    <main>
      <div class="inner">
        <section class="intro">
          <div class="box-heading">
            <h3>xxxxは、スプリント（反復）で進めるプロジェクトに最適な、プロジェクト管理ツールです。</h3>
            <p>離れた場所で作業する開発チームが、あたかも同じ空間で1つのボードを使っているかのように開発を進めることができるツールを目指しました。</p>
          </div>
          <!-- 会員登録 -->
          <div class="box-signup">
            <h3>さっそく使ってみる</h3>
            <p>無料ですぐに始めることができます。</p>
            <ul>
              <!-- ユーザー名 -->
              <li>
                <input
                  type="text"
                  v-model="displayName"
                >
                <span class="error">
                  {{ displayNameError }}
                </span>
              </li>
              <!-- メールアドレス -->
              <li>
                <input
                  type="text"
                  v-model="email"
                >
                <span class="error">
                  {{ emailError }}
                </span>
              </li>
              <!-- パスワード -->
              <li>
                <input
                  type="text"
                  v-model="password"
                >
                <span class="error">
                  {{ passwordError }}
                </span>
              </li>
            </ul>
            <md-button
              class="md-raised md-primary primary-button"
            >
              アカウントを作成する
            </md-button>
          </div>
        </section>
        <!-- サービス特徴 -->
        <section class="about">
          <div>
            <h3></h3>
            <p></p>
          </div>
          <img src="">
        </section>
        <section class="about">
          <img src="">
          <div>
            <h3></h3>
            <p></p>
          </div>
        </section>
        <section class="about">
          <img src="">
          <div>
            <h3></h3>
            <p></p>
          </div>
        </section>
      </div>
    </main>

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
  name: 'Visitor',
  data () {
    return {
      displayName: '',
      displayNameError: '',
      email: '',
      emailError: '',
      password: '',
      passwordError: '',
      showsIndicator: false
    }
  },
  methods: {
    signUp () {
      // ユーザー名バリデーション
      const regex = /^[a-zA-Z0-9_\-.]{3,15}/
      if (!regex.test(this.displayName)) {
        this.displayNameError = '3文字から15文字で半角英数字が使用できます。'
        return
      } else {
        this.displayNameError = ''
      }

      // 会員登録API
      this.showsIndicator = true

      firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
        .then(userCredential => {
          // Auth Userをストアのステートにセット
          this.$store.dispatch('setAuthUser', userCredential.user)
          // FirestoreのUsersコレクションへ追加
          const uid = userCredential.user.uid
          return db.collection('users').doc(uid).set({
            email: userCredential.user.email,
            displayName: this.displayName
          })
        })
        .then(() => {
          // displayNameをAuth Userに登録
          const user = firebase.auth().currentUser
          return user.updateProfile({
            displayName: this.displayName
          })
        })
        .then(() => {
          // チーム一覧画面へ遷移
          router.push({ name: 'teamList' })
        })
        .catch(error => {
          switch (error.code) {
            case 'auth/email-already-in-use':
              this.emailError = 'すでに使われているメールアドレスです。'
              break
            case 'auth/invalid-email':
              this.emailError = 'メールアドレスの形式が無効です。'
              break
            case 'auth/weak-password':
              this.passwordError = '入力されたパスワードが簡単すぎます。'
              break
            default:
              this.emailError = '入力されたメールアドレスまたはパスワードが無効です。'
              break
          }
        })
        .finally(() => {
          this.showsIndicator = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
header {
  height: 64px;
  h1 {
    float: left;
  }
  .md-button {
    float: right;
  }
}
main {
  section {
    display: flex;
    .box-heading {
      width: 560px;
      padding-right: 8px;
    }
    .box-signup {
      width: 440px;
      padding-left: 8px;
    }
  }
}
</style>
