<template>
  <div>
    <md-toolbar>
      <h2>新規プロダクトバックログアイテム作成</h2>
    </md-toolbar>
    <md-dialog-content>
      <md-field>
        <label>タイトル</label>
        <md-textarea
          v-model="title"
          md-autogrow
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
        v-if="!isDescriptionPreview"
      >
        <label>詳細（Markdownで入力できます）</label>
        <md-textarea
          v-model="description"
        >
        </md-textarea>
      </md-field>
      <div
        v-if="isDescriptionPreview"
        class="markdown-preview"
      >
        <VueMarkdown
          :source="description"
        />
      </div>
      <md-field>
        <label>価値</label>
        <md-textarea
          v-model="value"
          md-autogrow
        >
        </md-textarea>
      </md-field>
        <!-- TODO: definitions of done -->
        <!-- TODO: checkbox for Ready -->
        <!-- TODO: actions: delete save -->
      </md-field>
      <md-dialog-actions>
        <md-button
          @click="submit"
          :disabled="title.length >= 1"
        >
          プロダクトバックログに追加する
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
    initialItemStatus: Number
  },
  data: function () {
    return {
      'title': '',
      'estimate': null,
      'order': '',
      'description': '',
      'isDescriptionPreview': false,
      'value': '',
      'isReady': true,
      'definitionsOfDone': []
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

.md-dialog-content {
  width: 600px;
  padding: 16px 24px 32px;
  overflow-y: scroll;

  .md-input {
  }

  .markdown-preview {
    width: 100%;
    height: 300px;
  }
}
</style>
