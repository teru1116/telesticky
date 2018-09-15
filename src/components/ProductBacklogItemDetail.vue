<template>
  <div
    class="dialog-content"
  >
    <div
      class="dialog-header"
    >
      <h2>
        プロダクトバックログアイテム
      </h2>
      <md-button
        @click="$router.push({ name: 'productBacklog' })"
        class="close-modal"
      >
        <md-icon>clear</md-icon>
      </md-button>
    </div>

    <md-dialog-content>
      <div
        class="dialog-content-inner"
      >

        <ul
          class="form-items"
        >
          <!-- タイトル -->
          <li>
            <h3>
              タイトル
              <md-button
                @click="editingForm = (editingForm !== 'title') ? 'title' : ''"
              >
                <md-icon>create</md-icon>
              </md-button>
            </h3>
            <p
              v-if="editingForm !== 'title'"
              @click="editingForm = 'title'"
              class="editable"
            >
              {{ item.title }}
            </p>
            <AutogrowTextarea
              v-if="editingForm === 'title'"
              v-model="title"
              @blur="editingForm = ''"
            />
          </li>

          <!-- 見積り -->
          <li>
            <h3>
              見積り
              <md-button
                @click="editingForm = (editingForm !== 'estimate') ? 'estimate' : ''"
              >
                <md-icon>create</md-icon>
              </md-button>
            </h3>
            <span
              v-if="editingForm !== 'estimate'"
              @click="editingForm = 'estimate'"
              class="editable"
            >
              {{ item.estimate }}
            </span>
            <input
              v-if="editingForm === 'estimate'"
              v-model.number="estimate"
              @blur="editingForm = ''"
              type=text
              class="form-item-estimate"
            />
            <span>
              {{ estimationUnit }}
            </span>
          </li>

          <!-- 詳細 -->
          <li>
            <h3>
              詳細
              <md-button
                @click="editingForm = (editingForm !== 'description') ? 'description' : ''"
              >
                <md-icon>create</md-icon>
              </md-button>
            </h3>
            <div
              v-if="editingForm !== 'description'"
              @click="editingForm = 'description'"
              class="markdown-preview editable"
            >
              <VueMarkdown
                :source="description"
              />
            </div>
            <AutogrowTextarea
              v-if="editingForm === 'description'"
              v-model="description"
              @blur="editingForm = ''"
            />
          </li>

          <!-- 価値 -->
          <li>
            <h3>
              価値
              <md-button
                @click="editingForm = (editingForm !== 'value') ? 'value' : ''"
              >
                <md-icon>create</md-icon>
              </md-button>
            </h3>
            <p
              v-if="editingForm !== 'value'"
              @click="editingForm = 'value'"
            >
              {{ item.value }}
            </p>
            <AutogrowTextarea
              v-if="editingForm === 'value'"
              v-model="value"
              @blur="editingForm = ''"
            />
          </li>

          <!-- 完成の定義 -->
          <li>
            <h3>完成の定義</h3>
            <ListedTextarea
              :source.sync="definitionsOfItemDone"
            />
          </li>
        </ul>

      </div>

      <md-dialog-actions>
        <md-button
          @click="onDeleteButtonClick"
          class="md-raised"
        >
          アイテムを削除
        </md-button>
        <md-button
          @click="onSaveButtonClick"
          class="md-raised primary-button"
        >
          変更を保存
        </md-button>
      </md-dialog-actions>

    </md-dialog-content>

    <!-- indicator -->
    <md-progress-spinner
      v-if="updating"
      md-mode="indeterminate"
    />

    <!-- snack bar -->
    <md-snackbar
      :md-active.sync="showSavedSnackbar"
      :md-duration="4000"
      :md-position="'center'"
      md-persistent
    >
      <span>
        {{ updateSucceeded ? `アイテムを更新しました。` : `アイテムの更新に失敗しました。時間を置いて再度お試しください。` }}
      </span>
    </md-snackbar>
  </div>
</template>

<script>
import VueMarkdown from 'vue-markdown'
import { mapActions } from 'vuex'
// components
import AutogrowTextarea from '@/components/AutogrowTextarea'
import ListedTextarea from '@/components/ListedTextarea'

export default {
  props: {
    item: Object,
    teamId: String,
    estimationUnit: String,
    definitionsOfDone: Array
  },
  data () {
    return {
      title: this.item.title,
      estimate: this.item.estimate,
      description: this.item.description,
      value: this.item.value,
      definitionsOfItemDone: this.item.definitionsOfItemDone,
      editingForm: '',
      updating: false,
      showSavedSnackbar: false,
      updateSucceeded: false,
      showDeletionSnackbar: false
    }
  },
  methods: {
    ...mapActions([
      'updateItem',
      'deleteItem'
    ]),
    onSaveButtonClick () {
      this.updating = true
      this.updateItem({
        teamId: this.teamId,
        itemId: this.item.id,
        item: {
          title: this.title,
          estimate: this.estimate,
          description: this.description,
          value: this.value,
          definitionsOfItemDone: this.definitionsOfItemDone
        }
      })
        .then(() => {
          this.updating = false
          this.showSavedSnackbar = true
          this.updateSucceeded = true
        })
        .catch(error => {
          this.updating = false
          this.showSnackbar = true
          this.updateSucceeded = false
          console.error(error)
        })
    },
    onDeleteButtonClick () {
      this.updating = true
      this.deleteItem({
        teamId: this.teamId,
        itemId: this.item.id
      })
        .then(() => {
          this.$router.push({ name: 'productBacklog' })
        })
        .catch(error => {
          this.updating = false
          this.showDeletionSnackbar = true
          console.error(error)
        })
    }
  },
  components: {
    VueMarkdown,
    AutogrowTextarea,
    ListedTextarea
  }
}
</script>

<style lang="scss" scoped>
.dialog-content {
  width: 960px;
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
      h3 {
        margin: 0 0 8px;
        padding: 0 4px;
        line-height: 32px;
      }
      .editable {
        padding: 8px 4px;
      }
      .markdown-preview {
        min-height: 24px;
      }
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
</style>
