<template>
  <div class="dialog-content">
    <div class="dialog-header">
      <h2>チームを追加する</h2>
      <md-button
        @click="$router.push('/teams')"
        class="close-modal"
      >
        <md-icon>clear</md-icon>
      </md-button>
    </div>

    <md-dialog-content>
      <div class="dialog-content-inner">
        <p>メンバーを招待して、新しくチームを作成しましょう。</p>

        <ul
          class="form-items"
        >
          <!-- チーム名-->
          <li>
            <h3>チーム名</h3>
            <input
              v-model="teamName"
              type=text
              class="form-team-name"
            />
          </li>

          <!-- 招待するメンバー -->
          <li
            class="form-item-multi-input"
          >
            <h3>招待するメンバー</h3>
            <ul>
              <li
                v-for="(member, index) in members"
                :key="index"
              >
                <!-- email -->
                <input
                  v-model="member.email"
                  type=text
                  placeholder="メールアドレス"
                  class="form-email"
                />

                <!-- displayName -->
                <input
                  v-model="member.displayName"
                  type=text
                  placeholder="ニックネーム"
                />

                <!-- ×ボタン -->
                <md-button
                  v-if="members.length !== 1"
                  @click="members.splice(index, 1)"
                >
                  <md-icon>clear</md-icon>
                </md-button>
              </li>
            </ul>
            <md-button
              v-if="showsAddMemberButton"
              @click="members.push({'email': '', 'displayName': ''})"
            >
              <md-icon>add</md-icon>
            </md-button>
          </li>

          <!-- スプリントの期間-->
          <li
            class="form-item-sprint-duration"
          >
            <h3>スプリントの期間</h3>
            <input
              v-model.number="sprintDuration"
              type=text
              class="form-item-estimate"
            />
            <span>日</span>
          </li>
        </ul>
      </div>
      <md-dialog-actions>
        <md-button
          class="md-raised md-primary primary-button"
          @click="onCreateTeamButtonClick"
        >
          スクラムチームを作成する
        </md-button>
      </md-dialog-actions>
    </md-dialog-content>

    <!-- indicator -->
    <md-progress-spinner
      v-if="updating"
      md-mode="indeterminate"
    />
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  props: {
    uid: String
  },
  computed: {
    showsAddMemberButton () {
      for (let i = 0; i < this.members.length; i++) {
        if (!this.members[i]['email']) return false
      }
      return true
    }
  },
  data () {
    return {
      teamName: '',
      members: [],
      sprintDuration: 7,
      updating: false
    }
  },
  methods: {
    ...mapActions([
      'createTeam'
    ]),
    onCreateTeamButtonClick () {
      this.updating = true
      const members = this.members.filter(member => member.email.length > 0)
      this.createTeam({
        uid: this.uid,
        newTeam: {
          teamName: this.teamName,
          members: members,
          sprintDuration: this.sprintDuration
        }
      })
        .then(() => {
          this.updating = false
          this.$emit('createTeamFinish')
        })
        .catch(error => {
          this.updating = false
          console.error(error)
        })
    }
  },
  created () {
    // 初期状態で3人分の入力欄を用意
    for (let i = 0; i < 3; i++) {
      this.members.push({
        'email': '',
        'displayName': ''
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-content {
  width: 640px;
  .dialog-header {
    padding: 4px 8px;
    h2 {
      display: inline-block;
    }
    .md-button {
      &.close-modal {
        float: right;
        min-width: 44px;
        background-color: rgba(0, 0, 0, 0);
        .md-icon {
          color: #fff;
        }
      }
    }
  }
  .md-dialog-content {
    max-height: calc(80vh - 48px);
    overflow-y: auto;
    padding: 0;
    .dialog-content-inner {
      padding: 16px 24px 72px;
      ul.form-items {
        margin: 16px 0 0;
      }
    }
    .md-dialog-actions {
      position: fixed;
      bottom: 0;
      height: 48px;
      width: 100%;
      padding: 0 24px;
      border-top: 1px solid rgba(0,0,0,0.12);
      background-color: #fff;
      z-index: 15;
    }
  }
}
</style>
