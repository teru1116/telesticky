<template>
  <div>
    <!-- toolbar content -->
    <div class="toolbar-content">
      <h2
        :style="menuVisible ? { marginLeft: '0' } : { marginLeft: '48px' }">
      チーム設定
      </h2>
    </div>

    <!-- コンテンツ -->
    <div class="main-content-container">

      <div
        class="form-short-width"
      >
        <h3>基本情報</h3>

        <!-- チーム名-->
        <md-field>
          <label>チーム名</label>
          <md-input
            v-model="teamName"
          />
        </md-field>
      </div>

      <div
        class="form-short-width"
      >
        <h3>スクラム</h3>

        <!-- スプリント期間 -->
        <md-field>
          <label>スプリントの期間</label>
          <md-input
            v-model.number="sprintDuration"
          />
          <span class="md-suffix">
            日
          </span>
        </md-field>

        <!-- 完成の定義 -->
        <div
          class="multi-inputs-dod"
        >
          <label>
            完成の定義
          </label>
          <ul>
            <li
              v-for="(definition, index) in definitionsOfDone"
              :key="index"
            >
              <md-field>
                <md-textarea
                  v-model="definition.title"
                  md-autogrow
                >
                </md-textarea>
              </md-field>
              <md-button
                v-if="definitionsOfDone.length !== 1"
                @click="definitionsOfDone.splice(index, 1)"
              >
                <md-icon>clear</md-icon>
              </md-button>
            </li>
          </ul>
          <md-button
            v-if="showsDodAddButton"
            @click="definitionsOfDone.push({'title': ''})"
          >
            <md-icon>add</md-icon>
          </md-button>
        </div>
      </div>

      <div
        class="form-short-width"
      >
        <h3>プランニング</h3>

        <!-- 見積りの単位 -->
        <md-field>
          <label>見積りの単位</label>
          <md-input
            v-model="estimationUnit"
          />
        </md-field>
      </div>

      <md-button
        class="md-raised md-primary"
        @click="submit"
      >
        設定を更新する
      </md-button>

    </div>

    <!-- spinner -->
    <md-progress-spinner
      v-if="isProcessing"
      md-mode="indeterminate"
    />

    <!-- snack bar -->
    <md-snackbar
      :md-position="'center'"
      :md-duration="4000"
      :md-active.sync="isCorrectlyUpdated"
      md-persistent
    >
      <span>設定を更新しました</span>
    </md-snackbar>

  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  props: {
    team: Object,
    menuVisible: Boolean
  },
  data: function () {
    return {
      // input item
      teamName: this.team.name,
      sprintDuration: this.team.sprintDuration,
      definitionsOfDone: this.team.definitionsOfDone,
      estimationUnit: this.team.estimationUnit,
      // ui state
      isProcessing: false,
      isCorrectlyUpdated: false
    }
  },
  computed: {
    showsDodAddButton: function () {
      for (let i = 0; i < this.definitionsOfDone.length; i++) {
        if (!this.definitionsOfDone[i]['title']) return false
      }
      return true
    }
  },
  methods: {
    ...mapActions([
      'updateTeamSettings'
    ]),
    submit: function () {
      this.isProcessing = true
      this.update({
        'teamId': this.team.id,
        'teamSettings': {
          'teamName': this.teamName,
          'sprintDuration': this.sprintDuration,
          'definitionsOfDone': this.definitionsOfDone,
          'estimationUnit': this.estimationUnit
        }
      })
        .then(() => {
          this.isProcessing = false
          this.isCorrectlyUpdated = true
        })
        .catch(error => {
          this.isProcessing = false
          console.error(error)
        })
    }
  },
  watch: {
    'team.name': function () {
      this.teamName = this.team.name
    },
    'team.sprintDuration': function () {
      this.sprintDuration = this.team.sprintDuration
    },
    'team.definitionsOfDone': function () {
      this.definitionsOfDone = this.team.definitionsOfDone
    },
    'team.estimationUnit': function () {
      this.estimationUnit = this.team.estimationUnit
    }
  }
}
</script>

<style scoped lang="scss">
.main-content-container {
  padding: 16px;

  .form-short-width {
    width: 400px;
  }

  h3 {
    margin: 40px 0 24px!important;
  }

  .multi-inputs-dod {
    margin-bottom: 24px;
    ul {
      padding-left: 16px;
      list-style: none;
      li {
        display: flex;
        .md-button {
          margin-top: 16px;
        }
      }
    }
    .md-button {
      min-width: 0;
      margin: 0 0 0 16px;
    }
  }

  .md-button {
    margin: 40px 0 64px;
  }
}

.md-progress-spinner {
  position: absolute;
  top: calc(50% - 40px);
  left: calc(50% - 30px);
}
</style>
