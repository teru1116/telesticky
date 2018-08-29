<template>
  <div>
    <md-toolbar>
      <h2>新規プロダクトバックログアイテム作成</h2>
    </md-toolbar>
    <md-dialog-content>
      <div
        class="dialog-content-inner"
      >
        <md-field>
          <label>タイトル</label>
          <md-textarea
            v-model="title"
            md-autogrow
            required
          />
        </md-field>
        <md-field>
          <label>見積り</label>
          <md-input
            v-model.number="estimate"
            type="number"
            class="estimate"
          />
        </md-field>
        <md-field
          v-if="!showsDescriptionPreview"
        >
          <label>詳細（Markdownで入力できます）</label>
          <md-textarea
            v-model="description"
          >
          </md-textarea>
        </md-field>
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
        <md-field>
          <label>価値</label>
          <md-textarea
            v-model="value"
            md-autogrow
          >
          </md-textarea>
        </md-field>
        <div
          class="multi-inputs-dod"
        >
          <label>
            完成の定義
          </label>
          <ul>
            <li
              v-for="(itemDod, index) in definitionsOfItemDone"
              :key="index"
            >
              <md-field>
                <md-textarea
                  v-model="itemDod.title"
                  md-autogrow
                >
                </md-textarea>
              </md-field>
              <md-button
                v-if="definitionsOfItemDone.length !== 1"
                @click="definitionsOfItemDone.splice(index, 1)"
              >
                <md-icon>clear</md-icon>
              </md-button>
            </li>
          </ul>
          <md-button
            v-if="showsDodAddButton"
            @click="definitionsOfItemDone.push({'title': ''})"
          >
            <md-icon>add</md-icon>
          </md-button>
        </div>
        <div
          class="input-isready"
        >
          <md-checkbox
            v-model="isReady"
          />
          <span>
            準備完了（Ready）なアイテムか
          </span>
        </div>
      </div>
      <md-dialog-actions>
        <md-button
          @click="submit"
          class="md-raised md-primary"
          :disabled="!title"
        >
          プロダクトバックログに追加
        </md-button>
      </md-dialog-actions>
    </md-dialog-content>
    <md-progress-spinner
      v-if="isProcessing"
      md-mode="indeterminate"
    />
  </div>
</template>

<script>
import VueMarkdown from 'vue-markdown'
import { mapActions } from 'vuex'

export default {
  props: {
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
      'isReady': true,
      'definitionsOfItemDone': this.definitionsOfDone,
      'isProcessing': false
    }
  },
  computed: {
    showsDodAddButton: function () {
      for (let i = 0; i < this.definitionsOfItemDone.length; i++) {
        if (!this.definitionsOfItemDone[i]['title']) return false
      }
      return true
    }
  },
  methods: {
    ...mapActions({
      addItem: 'addItem'
    }),
    submit: function () {
      this.isProcessing = true
      this.addItem({
        'teamId': this.team.id,
        'newItem': {
          'title': this.title,
          'estimate': this.estimate,
          'description': this.description,
          'value': this.value,
          'isReady': this.isReady,
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
    VueMarkdown
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

.md-dialog-container {
  .md-toolbar {
    height: 48px;
  }

  .md-dialog-content {
    max-height: calc(80vh - 48px);
    overflow-y: auto;
    width: 680px;
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

      .input-isready {
        span {
          vertical-align: text-bottom;
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
}

.md-progress-spinner {
  position: absolute;
  top: calc(50% - 40px);
  left: calc(50% - 30px);
}
</style>
