<template>
  <div>
    <ul>
      <li
        v-for="(text, index) in textList"
        :key="index"
      >
        <AutogrowTextarea
          v-model="textList[index]"
          @blur="updateSource"
        />
        <md-button
          v-if="textList.length !== 1"
          @click="textList.splice(index, 1)"
          class="textitem-remove"
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
import AutogrowTextarea from '@/components/AutogrowTextarea'

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
      textList: this.source || ['']
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
  },
  components: {
    AutogrowTextarea
  }
}
</script>

<style lang="scss" scoped>
li {
  display: flex;
  textarea {
    flex: 1;
    min-width: auto!important;
  }
  .md-button.textitem-remove {
    height: 32px;
  }
  margin-bottom: 8px;
}
</style>