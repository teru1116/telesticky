<template>
  <div
    class="container"
  >
    <nav>
      <ul>
        <li>
          <router-link
            to="/"
          >
            <h3>スプリントバックログ</h3>
            <small>今スプリントの計画です</small>
          </router-link>
          <router-link
            to="/"
          >
            <h3>プロダクトバックログ</h3>
            <small>今後の実装の全ての一覧です</small>
          </router-link>
          <router-link
            to="/"
          >
            <h3>チームメンバー</h3>
            <small>メンバーの招待や管理を行います</small>
          </router-link>
          <router-link
            to="/"
          >
            <h3>設定</h3>
            <small>ワークフローや見積りの単位などを設定します</small>
          </router-link>
        </li>
      </ul>
    </nav>
    <div
      class="main-content"
    >
      <router-view />
    </div>
  </div>
</template>

<script>
</script>

<style scoped lang="scss">
.container {
  display: flex;

  nav {
    width: 300px;
    background-color: #222;
    height: 100vh;

    ul {
      list-style: none;

      li {
        a {
          color: #fff;
          padding: 0 16px;
          display: block;

          &:hover {
            color: #4cabff;
          }
        }
      }
    }
  }

  .main-content {
    padding: 0 16px;
  }
}
</style>
