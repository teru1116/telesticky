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
            v-model="teamName"
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
            v-model.number="estimationUnit"
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

      <md-button
        class="md-raised sensitive-button"
        @click="confirmDeleteProject = true"
      >
        プロジェクトを削除する
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

    <!-- confirm delete project -->
    <md-dialog
      :md-active.sync="confirmDeleteProject"
    >
      <md-dialog-title>プロジェクトを削除する</md-dialog-title>
      <md-dialog-content>
        <p>
          プロジェクトを削除するには、このプロジェクトのID
          <code>{{ team.id }}</code>
          を入力してください。
        </p>
        <input
          v-model="projectIdForDelete"
          type="text"
        >
      </md-dialog-content>
      <md-dialog-actions>
        <md-button
          class="md-primary"
          @click="confirmDeleteProject = false"
        >
          キャンセル
        </md-button>
        <md-button
          class="md-primary"
          @click="deleteProject"
          :disabled="projectIdForDelete !== team.id"
        >
          プロジェクトを削除する
        </md-button>
      </md-dialog-actions>
    </md-dialog>

    <!-- indicator -->
    <md-progress-spinner
      v-if="loading"
      md-mode="indeterminate"
    />

  </div>
</template>

<script>
import { mapActions } from 'vuex'
import router from '@/router'
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
      isCorrectlyUpdated: false,
      confirmDeleteProject: false,
      projectIdForDelete: '',
      enableDeleteProject: false,
      loading: false
    }
  },
  methods: {
    ...mapActions([
      'updateTeamSettings',
      'deleteTeam'
    ]),
    submit: function () {
      this.isProcessing = true
      this.update({
        teamId: this.team.id,
        teamSettings: {
          teamName: this.teamName,
          sprintDuration: this.sprintDuration,
          definitionsOfDone: this.definitionsOfDone,
          estimationUnit: this.estimationUnit
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
    },
    deleteProject () {
      this.loading = true
      this.deleteTeam({
        teamId: this.team.id
      })
        .then(() => {
          this.loading = false
          router.push('/teams')
        })
        .catch(error => {
          console.error(error)
        })
    }
  },
  components: {
    ListedTextarea
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
  .sensitive-button {
    display: block;
    margin: 40px 0 0;
  }
}
.md-dialog-content {
  p {
    padding: 8px 0;
  }
  code {
    color: #f58310;
    padding: 2px 4px;
  }
}
</style>
