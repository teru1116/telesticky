<template>
  <div
    class="dialog-content"
  >
    <div
      class="dialog-header"
    >
      <h2>
        新規プロダクトバックログアイテム作成
      </h2>
    </div>
    <md-dialog-content>
      <div
        class="dialog-content-inner"
      >

        <ul
          class="form-items"
        >
          <!-- タイトル-->
          <li>
            <h3>
              タイトル
            </h3>
            <AutogrowTextarea
              v-model="title"
            />
          </li>

          <!-- 見積り -->
          <li>
            <h3>
              見積り
            </h3>
            <input
              v-model.number="estimate"
              type=text
              class="form-item-estimate"
            />
            <span
              class="input-estimation-unit"
            >
              {{ estimationUnit }}
            </span>
          </li>

          <!-- 詳細 -->
          <li>
            <h3>
              詳細
            </h3>
            <small>
              Markdown形式で入力できます
            </small>
            <AutogrowTextarea
              v-if="!showsDescriptionPreview"
              v-model="description"
            />
            <div
              v-if="showsDescriptionPreview"
              class="markdown-preview"
            >
              <VueMarkdown
                :source="description"
              />
            </div>
            <md-button
              v-if="description"
              class="md-dense md-primary markdown-preview-button"
              @click="showsDescriptionPreview = !showsDescriptionPreview"
            >
              {{ showsDescriptionPreview ? '編集' : 'プレビュー' }}
            </md-button>
          </li>

          <!-- 価値 -->
          <li>
            <h3>
              価値
            </h3>
            <AutogrowTextarea
              v-model="value"
            />
          </li>

          <!-- 完成の定義 -->
          <li>
            <div
              class="multi-inputs"
            >
              <h3>
                完成の定義
              </h3>
              <ListedTextarea
                v-bind:source="definitionsOfItemDone"
                v-on:update="updatedSource => definitionsOfItemDone = updatedSource"
              />
            </div>
          </li>

        </ul>

      </div>
      <md-dialog-actions>
        <md-button
          @click="submit"
          class="md-raised primary-button"
          :disabled="!title"
        >
          プロダクトバックログに追加
        </md-button>
      </md-dialog-actions>
    </md-dialog-content>

    <!-- indicator -->
    <md-progress-spinner
      v-if="isProcessing"
      md-mode="indeterminate"
    />
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
    teamId: String,
    estimationUnit: String,
    initialItemStatus: Number,
    definitionsOfDone: Array
  },
  data: function () {
    return {
      'title': '',
      'estimate': null,
      'description': '',
      'showsDescriptionPreview': false,
      'value': '',
      'definitionsOfItemDone': this.definitionsOfDone,
      'isProcessing': false
    }
  },
  methods: {
    ...mapActions({
      addItem: 'addItem'
    }),
    submit: function () {
      this.isProcessing = true
      this.addItem({
        'teamId': this.teamId,
        'newItem': {
          'title': this.title,
          'estimate': this.estimate,
          'description': this.description,
          'value': this.value,
          'definitionsOfItemDone': this.definitionsOfDone,
          'status': this.initialItemStatus
        }
      })
        .then(() => {
          this.isProcessing = false
          this.$emit('onCreateItemFinish')
        })
        .catch(error => {
          this.isProcessing = false
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

<style scoped lang="scss">
.md-toolbar {
  background-color: #03a9f4!important;
  padding: 0 24px;

  h2 {
    font-size: 20px;
    font-weight: 400;
    color: #fff;
  }
}

.dialog-content {
  width: 960px;
}

.md-dialog-container {
  .md-toolbar {
    height: 48px;
  }

  .md-dialog-content {
    max-height: calc(80vh - 48px);
    overflow-y: auto;
    padding: 0;

    .dialog-content-inner {
      padding: 16px 24px 72px;

      .markdown-preview {
        width: 100%;
        min-height: 40px;
      }

      .md-button.markdown-preview-button {
        margin: -16px 0 0;
        float: right;
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
