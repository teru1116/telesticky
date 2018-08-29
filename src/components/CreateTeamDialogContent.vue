<template>
  <div>
    <md-toolbar>
      <h2>新規チーム作成</h2>
    </md-toolbar>

    <md-dialog-content>
      <div
        class="dialog-content-inner"
      >

        <!-- チーム名-->
        <md-field>
          <label>チーム名</label>
          <md-input
            v-model="teamName"
          />
        </md-field>

        <!-- 招待するメンバー -->
        <div
          class="form-item-members"
        >
          <label>
            招待するメンバー
          </label>
          <ul>
            <li
              v-for="(member, index) in members"
              :key="index"
            >
              <!-- メールアドレス -->
              <md-field>
                <label>メールアドレス</label>
                <md-input
                  v-model="member.email"
                  type="email"
                />
              </md-field>

              <!-- 名前 -->
              <md-field>
                <label>名前</label>
                <md-input
                  v-model="member.userName"
                />
              </md-field>

              <!-- 役割 -->
              <md-field>
                <label>役割</label>
                <md-input
                  v-model="member.role"
                />
              </md-field>

              <!-- ×ボタン -->
              <md-button
                v-if="members.length !== 1"
                class="remove-field-button"
                @click="members.splice(index, 1)"
              >
                <md-icon>clear</md-icon>
              </md-button>
            </li>
          </ul>
          <md-button
            v-if="showsAddMemberButton"
            class="add-field-button"
            @click="members.push({'email': '', 'displayName': '', 'role': ''})"
          >
            <md-icon>add</md-icon>
          </md-button>
        </div>

        <!-- スプリント期間 -->
        <md-field
          class="form-item-duration"
        >
          <label>スプリントの期間</label>
          <md-input
            v-model.number="sprintDuration"
          />
          <span class="md-suffix">
            日
          </span>
        </md-field>

        <md-button
          @click="onCreateTeamButtonClick"
        >
          スクラムチームを作成する
        </md-button>

      </div>
    </md-dialog-content>

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
      this.$emit('onCreateTeamFinish')
    }
  },
  created () {
    // 初期状態で3人分の入力欄を用意
    for (let i = 0; i < 3; i++) {
      this.members.push({
        'email': '',
        'displayName': '',
        'role': ''
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.form-item-members {
  ul {
    li {
      display: inline-flex;

      .md-field {
        margin-right: 16px;
        &:last-child {
          margin-right: 0;
        }
      }

      .remove-field-button {
        min-width: 48px;
        margin: 16px 0 0;
      }
    }
  }

  .add-field-button {
    margin: 0 0 24px;
  }
}

.form-item-duration {
  width: 160px;
}
</style>
