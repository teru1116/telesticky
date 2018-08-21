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
            v-model="estimate"
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
        <!-- TODO: definitions of done -->
        <div
          class="input-isready"
        >
          <md-checkbox
            v-model="isReady"
          />
          <span>
            準備完了（Ready）
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
      'additionalDefinitionsOfDone': this.definitionsOfDone
    }
  },
  methods: {
    ...mapActions({
      create: 'addProductBacklogItem'
    }),
    submit: function () {
      this.create({
        'title': this.title,
        'estimate': this.estimate,
        'status': this.initialItemStatus
      })
        .then(() => {
          this.$emit('onCreateItemFinish')
        })
        .catch(error => {
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
</style>
