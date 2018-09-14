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
            <textarea
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
            <textarea
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
            <textarea
              v-if="editingForm === 'value'"
              v-model="value"
              @blur="onEditingFinish('value', value)"
            />
          </li>

          <!-- 完成の定義 -->
          <li>
            <h3>完成の定義</h3>
          </li>
        </ul>

      </div>
    </md-dialog-content>
  </div>
</template>

<script>
import VueMarkdown from 'vue-markdown'
import { mapActions } from 'vuex'

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
      editingForm: ''
    }
  },
  methods: {
    ...mapActions([
      'updateItem'
    ]),
    onEditingFinish (field, value) {
      this.editingForm = ''
      this.updateItem({
        teamId: this.teamId,
        itemId: this.item.id,
        field: field,
        value: value
      })
        .then(() => {
          //
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

<style lang="scss" scoped>
.dialog-content {
  width: 860px;
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
