<template>
  <div
    class="dialog-content"
  >
    <div
      class="dialog-header"
    >
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
              @blur="onEditingFinish('title', title)"
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
              @blur="onEditingFinish('estimate', estimate)"
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
              @blur="onEditingFinish('description', description)"
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
              @blur="onEditingFinish('value', value)"
            />
          </li>

          <!-- 完成の定義 -->
          <li>
            <h3>完成の定義</h3>
            <ListedTextarea
              v-bind:source="definitionsOfItemDone"
              v-on:update="updatedSource => definitionsOfItemDone = updatedSource"
            />
          </li>
        </ul>

      </div>
    </md-dialog-content>

    <!-- indicator -->
    <md-progress-spinner
      v-if="updating"
      md-mode="indeterminate"
    />

    <!-- snack bar -->
    <md-snackbar
      :md-active.sync="updateResult.finished"
      :md-duration="4000"
      :md-position="'center'"
      md-persistent
    >
      <span>
        {{ updateResult.isSuccess ? `${getFormDisplayName(updateResult.field)}を更新しました。` : `${getFormDisplayName(updateResult.field)}の更新に失敗しました。時間を置いて再度お試しください。` }}
        <small
          v-if="!updateResult.isSuccess && updateResult.error"
        >
          {{ updateResult.error.code }}
        </small>
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
      definitionsOfItemDone: this.item.definitionsOfItemDone,
      editingForm: '',
      updating: false,
      updateResult: {
        finished: false,
        isSuccess: false,
        field: ''
      }
    }
  },
  methods: {
    ...mapActions([
      'updateItem'
    ]),
    onEditingFinish (field, value) {
      this.updating = true
      this.updateResult.field = field
      this.editingForm = ''

      this.updateItem({
        teamId: this.teamId,
        itemId: this.item.id,
        field: field,
        value: value
      })
        .then(() => {
          this.updating = false
          this.updateResult.finished = true
          this.updateResult.isSuccess = true
        })
        .catch(error => {
          this.updating = false
          this.updateResult.finished = true
          this.updateResult.isSuccess = false
          this.updateResult.error = error
        })
    },
    getFormDisplayName (field) {
      switch (field) {
        case 'title': return 'タイトル'
        case 'estimate': return '見積り'
        case 'description': return '詳細'
        case 'value': return '価値'
        case 'definitionsOfItemDone': return '完成の定義'
      }
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
    background-color: #fff;
    padding: 4px 8px;
    .md-button {
      &.close-modal {
        float: right;
        min-width: 44px;
      }
    }
  }
  .md-dialog-content {
    h3 {
      margin: 0 0 8px;
      padding: 0 4px;
      line-height: 32px;
    }
    .editable {
      padding: 8px 4px;
    }
  }
  .markdown-preview {
    min-height: 24px;
  }
}
</style>
