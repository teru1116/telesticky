<template>
  <div>
    <md-button
      @click="$router.push({ name: 'productBacklog' })"
    >
      <md-icon>clear</md-icon>
    </md-button>

    <md-dialog-content>
      <div
        class="dialog-content-inner"
      >

        <ul
          class="form-items"
        >
          <!-- タイトル -->
          <li>
            <h3>タイトル</h3>
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
              @blur="updateItem('title', title)"
            />
          </li>

          <!-- 見積り -->
          <li>
            <h3>見積り</h3>
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
              @blur="updateItem('estimate', estimate)"
              type=text
              class="form-item-estimate"
            />
            <span>
              {{ estimationUnit }}
            </span>
          </li>

          <!-- 詳細 -->
          <li>
            <h3>詳細</h3>
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
              @blur="updateItem('description', description)"
            />
          </li>

          <!-- 価値 -->
          <li>
            <h3>価値</h3>
            <p
              v-if="editingForm !== 'value'"
              @click="editingForm = 'value'"
            >
              {{ item.value }}
            </p>
            <textarea
              v-if="editingForm === 'value'"
              v-model="value"
              @blur="updateItem('value', value)"
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
    updateItem (field, value) {
      this.editingForm = ''
      console.log(field, value)
    }
  },
  components: {
    VueMarkdown
  }
}
</script>

<style lang="scss" scoped>
.markdown-preview {
  min-height: 24px;
}
</style>
