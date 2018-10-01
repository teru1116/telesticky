<template>
  <div class="inner">

    <!-- header -->
    <div class="content-header">
      <h2>チーム設定</h2>
    </div>

    <!-- body -->
    <div class="main-content-container">
      <ul class="form-items">

        <!-- チーム名 -->
        <li>
          <h3>チーム名</h3>
          <input
            v-model="teamName"
            type="text"
            class="large"
          />
        </li>

        <!-- スプリント期間 -->
        <li>
          <h3>スプリント期間</h3>
          <input
            v-model.number="sprintDuration"
            type="text"
            class="form-item-estimate"
          />
          <span>日</span>
        </li>

        <!-- 完成の定義 -->
        <li>
          <h3>完成の定義</h3>
          <ListedTextarea
            :source.sync="definitionsOfDone"
          />
        </li>

        <!-- 見積りの単位 -->
        <li>
          <h3>見積りの単位</h3>
          <input
            v-model.number="estimationUnit"
            type="text"
            class="form-item-estimate"
          />
        </li>
      </ul>

      <md-button
        class="md-raised md-primary primary-button"
        @click="updateTeamSettings"
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

    <!-- チーム削除確認ダイアログ -->
    <md-dialog
      :md-active.sync="confirmDeleteProject"
    >
      <md-dialog-title>チームを削除する</md-dialog-title>
      <md-dialog-content>
        <p>
          チームを削除するには、このチームのID
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
          @click="deleteTeam"
          :disabled="projectIdForDelete !== team.id"
        >
          チームを削除する
        </md-button>
      </md-dialog-actions>
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
import ListedTextarea from '@/components/ListedTextarea'

export default {
  props: {
    team: Object
  },
  data () {
    return {
      teamName: this.team.name,
      sprintDuration: this.team.sprintDuration,
      definitionsOfDone: this.team.definitionsOfDone,
      estimationUnit: this.team.estimationUnit,
      confirmDeleteProject: false,
      projectIdForDelete: '',
      enableDeleteProject: false,
      showsIndicator: false,
      showsSnackbar: false,
      snackbarMessage: ''
    }
  },
  methods: {
    updateTeamSettings () {
      const payload = {
        teamId: this.team.id,
        teamSettings: {
          teamName: this.teamName,
          sprintDuration: this.sprintDuration,
          definitionsOfDone: this.definitionsOfDone,
          estimationUnit: this.estimationUnit
        }
      }

      this.showsIndicator = true
      this.$store.dispatch('updateTeamSettings', payload)
        .then(() => {
          this.showSnackbar('チーム情報を更新しました。')
        })
        .catch(error => {
          this.showSnackbar('エラー: チームの削除に失敗しました。')
          console.error(error)
        })
        .finally(() => {
          this.showsIndicator = false
        })
    },
    deleteTeam () {
      this.showsIndicator = true
      this.$store.dispatch('deleteTeam', this.team.id)
        .then(() => {
          this.$router.push('/teams')
        })
        .catch(error => {
          this.showSnackbar('エラー: チームの削除に失敗しました。')
          console.error(error)
        })
        .finally(() => {
          this.showsIndicator = false
        })
    },
    showSnackbar (message) {
      this.snackbarMessage = message
      this.showsSnackbar = true
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
