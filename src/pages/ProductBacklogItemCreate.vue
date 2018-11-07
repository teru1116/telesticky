<template>
  <div class="dialog-content">
    <div class="dialog-header">
      <h2>新規バックログアイテム作成</h2>
      <md-button
        @click="$router.push({ name: 'productBacklog' })"
        class="close-modal"
      >
        <md-icon>clear</md-icon>
      </md-button>
    </div>
    <md-dialog-content>
      <div class="dialog-content-inner">
        <ul class="form-items">
          <!-- タイトル-->
          <li>
            <h3>タイトル</h3>
            <AutogrowTextarea
              v-model="title"
            />
          </li>

          <!-- 見積り -->
          <li>
            <h3>見積り</h3>
            <input
              v-model.number="estimate"
              type="text"
              class="form-item-estimate"
            />
            <span class="input-estimation-unit">{{ estimationUnit }}</span>
          </li>

          <!-- 詳細 -->
          <li>
            <h3>詳細</h3>
            <small>Markdown形式で入力できます</small>
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
              class="md-dense md-raised markdown-preview-button"
              @click="showsDescriptionPreview = !showsDescriptionPreview"
            >
              {{ showsDescriptionPreview ? '編集' : 'プレビュー' }}
            </md-button>
          </li>

        </ul>

      </div>
      <md-dialog-actions>
        <md-button
          @click="addItem"
          class="md-raised primary-button"
          :disabled="!title"
        >
          バックログに追加
        </md-button>
      </md-dialog-actions>
    </md-dialog-content>

    <!-- インジケータ -->
    <md-progress-spinner
      v-if="showsIndicator"
      md-mode="indeterminate"
    />
  </div>
</template>

<script>
import VueMarkdown from 'vue-markdown'
import AutogrowTextarea from '@/components/AutogrowTextarea'
import ListedTextarea from '@/components/ListedTextarea'

export default {
  props: {
    teamId: String,
    estimationUnit: String,
    initialItemStatus: Number,
    definitionsOfDone: Array
  },
  data () {
    return {
      title: '',
      estimate: null,
      description: '',
      showsDescriptionPreview: false,
      showsIndicator: false
    }
  },
  methods: {
    addItem () {
      this.showsIndicator = true

      this.$store.dispatch('addItem', {
        teamId: this.teamId,
        newItem: {
          title: this.title,
          estimate: this.estimate,
          description: this.description,
          status: this.initialItemStatus
        }
      })
        .then(() => {
          this.$emit('createItemSucceeded')
          this.$router.push({ name: 'productBacklog' })
        })
        .catch(error => {
          this.$emit('createItemFailed', error)
        })
        .finally(() => {
          this.showsIndicator = false
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
      .markdown-preview {
        width: 100%;
        min-height: 40px;
      }
      .md-button.markdown-preview-button {
        margin: 8px 0 0;
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
