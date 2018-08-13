<template>
  <div>
    <div
      class="pbl-header"
    >
      <h2>
        スプリントバックログ
      </h2>
      <div
        class="pbl-header-right"
      >
        <button
          class="enabled"
        >
          + スプリントで届けるプロダクトバックログアイテムを選択する
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.pbl-header {
  display: flex;
  height: 64px;
  border-bottom: 1px solid #e5e5e5;
  margin-bottom: 24px;

  h2 {
    width: 300px;
    font-size: 24px;
    line-height: 24px;
    margin: 20px 0 0;
    text-align: left;
  }

  .pbl-header-right {
    flex: 1;

    button {
      float: right;
      margin-top: 18px;
    }
  }
}
</style>
