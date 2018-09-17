<template>
  <div
    class="piu"
    @click="$refs.piuInput.click()"
  >
    <canvas
      :width="width"
      :height="width"
      ref="piuCanvas"
    />
    <input
      type="file"
      ref="piuInput"
      :style="{ display: 'none' }"
      @change="onFileSelect"
    />
  </div>
</template>

<script>
export default {
  props: {
    width: Number,
    height: Number,
    defaultPhotoURL: ''
  },
  data () {
    return {
      file: null
    }
  },
  methods: {
    onFileSelect (e) {
      e.preventDefault()

      const file = e.target.files[0]
      const image = new Image()
      const reader = new FileReader()
      reader.onload = () => {
        image.onload = () => {
          // canvas内のコンテンツを消去
          this.ctx.clearRect(0, 0, this.width, this.height)
          // imageを描画
          this.ctx.drawImage(image, 0, 0)
          // 親コンポーネントにimageのdata_urlを渡す
          this.$emit('change', image.src)
        }
        image.src = reader.result
      }
      reader.readAsDataURL(file)
    }
  },
  mounted () {
    this.ctx = this.$refs.piuCanvas.getContext('2d')

    if (this.defaultPhotoURL) {
      const image = new Image()
      image.onload = () => {
        this.ctx.drawImage(image, 0, 0)
      }
      image.src = this.defaultPhotoURL
    }
  }
}
</script>

<style lang="scss" scoped>
.piu {
  display: inline-block;
  cursor: pointer;
  background-color: aquamarine;
}
</style>