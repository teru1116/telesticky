<template>
  <div>
    <ul>
      <li
        v-for="(text, index) in textList"
        :key="index"
      >
        <textarea
          v-model="textList[index]"
          @blur="updateSource"
        />
        <md-button
          v-if="textList.length !== 1"
          @click="textList.splice(index, 1)"
        >
          <md-icon
            class="clear-icon"
          >
            clear
          </md-icon>
        </md-button>
      </li>
    </ul>
    <md-button
      v-if="showsAddButton"
      @click="addTextList"
    >
      <md-icon
        class="add-icon"
      >
        add
      </md-icon>
    </md-button>
  </div>
</template>

<script>
export default {
  props: {
    source: Array
  },
  computed: {
    showsAddButton () {
      for (let i = 0; i < this.textList.length; i++) {
        if (!this.textList[i]) return false
      }
      return true
    }
  },
  data () {
    return {
      textList: this.source
    }
  },
  methods: {
    updateSource () {
      this.$emit('update', this.textList)
    },
    addTextList () {
      this.textList.push('')
      this.$emit('update', this.textList)
    }
  }
}
</script>