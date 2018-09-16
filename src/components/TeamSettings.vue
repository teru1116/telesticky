<template>
  <div
    class="inner"
  >

    <!-- header -->
    <div
      class="content-header"
    >
      <h2>
        チーム設定
      </h2>
      <div
        class="header-items"
      >
      </div>
    </div>

    <!-- body -->
    <div class="main-content-container">
      <ul
        class="form-items"
      >

        <!-- チーム名 -->
        <li>
          <h3>
            チーム名
          </h3>
          <input
            v-model="title"
            type="text"
            class="large"
          />
        </li>

        <!-- スプリント期間 -->
        <li>
          <h3>
            スプリント期間
          </h3>
          <input
            v-model.number="sprintDuration"
            type="text"
            class="form-item-estimate"
          />
          <span>日</span>
        </li>

        <!-- 完成の定義 -->
        <li>
          <h3>
            完成の定義
          </h3>
          <ListedTextarea
            :source.sync="definitionsOfDone"
          />
        </li>

        <!-- 見積りの単位 -->
        <li>
          <h3>
            見積りの単位
          </h3>
          <input
            v-model.number="estimate"
            type="text"
            class="form-item-estimate"
          />
        </li>
      </ul>

      <md-button
        class="md-raised md-primary primary-button"
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
// components
import ListedTextarea from '@/components/ListedTextarea'

export default {
  props: {
    team: Object
  },
  data: function () {
    return {
      teamName: this.team.name,
      sprintDuration: this.team.sprintDuration,
      definitionsOfDone: this.team.definitionsOfDone,
      estimationUnit: this.team.estimationUnit,
      isProcessing: false,
      isCorrectlyUpdated: false
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
  },
  components: {
    ListedTextarea
  }
}
</script>

<style lang="scss" scoped>
.main-content-container {
  padding: 16px;
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
