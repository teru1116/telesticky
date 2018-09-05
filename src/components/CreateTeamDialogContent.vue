<template>
  <div>
    <div
      class="dialog-header"
    >
      <h2>
        チームを追加する
      </h2>
    </div>

    <div
      class="dialog-content"
    >
      <div
        class="dialog-content-inner"
      >
        <p>
          メンバーを招待して、新しくチームを作成しましょう。
        </p>

        <ul
          class="form-items"
        >
          <!-- チーム名-->
          <li>
            <h3
              class="form-item-label"
            >
              チーム名
            </h3>
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
            <h3
              class="form-item-label"
            >
              招待するメンバー
            </h3>
            <ul>
              <li
                v-for="(member, index) in members"
                :key="index"
              >
                <!-- email -->
                <input
                  v-model="member.email"
                  type=email
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
                <button
                  v-if="members.length !== 1"
                  class="remove-multi-form-item"
                  @click="members.splice(index, 1)"
                >
                  <i class="material-icons">clear</i>
                </button>
              </li>
            </ul>
            <button
              v-if="showsAddMemberButton"
              class="add-multi-form-item"
              @click="members.push({'email': '', 'displayName': ''})"
            >
              <i class="material-icons">add</i>
            </button>
          </li>
          <li
            class="form-item-sprint-duration"
          >
            <!-- スプリントの期間-->
            <h3
              class="form-item-label"
            >
              スプリントの期間
            </h3>
            <input
              v-model.number="sprintDuration"
              type=text
            />
            <span>日</span>
          </li>
        </ul>
      </div>
    </div>

    <div
      class="dialog-actions"
    >
      <md-button
        class="md-primary"
        @click="onCreateTeamButtonClick"
      >
        スクラムチームを作成する
      </md-button>
    </div>

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
      // form items
      'teamName': '',
      'members': [],
      'sprintDuration': 7
    }
  },
  methods: {
    ...mapActions([
      'createTeam'
    ]),
    onCreateTeamButtonClick () {
      this.createTeam({
        'uid': this.uid,
        'newTeam': {
          'teamName': this.teamName,
          'members': this.members,
          'sprintDuration': this.sprintDuration
        }
      })
        .then(() => {
          console.log('then')
          this.$emit('onCreateTeamFinish')
        })
        .catch(error => {
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
.dialog-header {
  background-color: #7b68ee;
  height: 48px;
  padding: 0 16px;
  h2 {
    color: #fff;
    line-height: 48px;
    font-size: 20px;
  }
}
.dialog-content {
  max-height: calc(100% - 48px - 60px);
  overflow: scroll;
  .dialog-content-inner {
    padding: 16px;
    p {
      margin-bottom: 24px;
    }
    .form-items {
      > li {
        margin-bottom: 24px;
        h3.form-item-label {
          color: #666;
          font-weight: 600;
          font-size: 14px;
          padding: 8px 0;
        }
        input.form-team-name {
          width: 240px;
        }
        input.form-email {
          width: 240px;
        }
        &.form-item-sprint-duration {
          input {
            width: 80px;
          }
          span {
            height: 34px;
            line-height: 34px;
          }
        }
        &.form-item-multi-input {
          ul {
            width: 480px;
            li {
              display: inline-flex;
              margin-bottom: 16px;
              input {
                margin-right: 8px;
              }
              button.remove-multi-form-item {
                color: #999;
              }
            }
          }
          button.add-multi-form-item {
            color: #999;
          }
        }
      }
    }
  }
}
.dialog-actions {
  height: 60px;
  width: 100%;
  padding: 0 16px;
  .md-button {
    float: right;
    margin: 12px 0;
  }
}
</style>
