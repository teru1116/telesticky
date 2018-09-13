<template>
  <div>
    <md-button
      @click="$router.push({ name: 'productBacklog' })"
    >
      <md-icon>clear</md-icon>
    </md-button>
    <ul>
      <!-- タイトル -->
      <li>
        <h3>タイトル</h3>
        <p
          v-if="editingForm !== 'title'"
          @click="editingForm = 'title'"
        >
          {{ item.title }}
        </p>
        <textarea
          v-if="editingForm === 'title'"
          v-model="title"
          @blur="updateItem('title', title)"
        />
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    item: Object
  },
  data () {
    return {
      title: this.item.title,
      editingForm: ''
    }
  },
  methods: {
    updateItem (field, value) {
      console.log(field, value)
    }
  }
}
</script>
