<template>
  <nav>
    <div
      class="inner"
    >
      <div
        class="nav-left-contents"
      >
        <router-link
          :to="{ name: 'teamList' }"
        >
          Scrum
        </router-link>
        <router-link
          v-if="team.id"
          :to="{ name: 'sprintBacklog', params: { teamId: team.id } }"
        >
          スプリントバックログ
        </router-link>
        <router-link
          v-if="team.id"
          :to="{ name: 'productBacklog', params: { teamId: team.id } }"
        >
          プロダクトバックログ
        </router-link>
        <router-link
          v-if="team.id"
          :to="{ name: 'teamSettings', params: { teamId: team.id } }"
        >
          チーム設定
        </router-link>
        <router-link
          v-if="team.id"
          :to="{ name: 'members', params: { teamId: team.id } }"
        >
          メンバー
        </router-link>
      </div>
      <div
        class="nav-right-contents"
      >
        <button
          v-if="authUser"
          :style="{ backgrountImage: authUser.photoURL }"
          class="account-thumbnail"
        />
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  props: {
    authUser: Object,
    team: Object
  }
}
</script>

<style lang="scss" scoped>
nav {
  background-color: #7b68ee;
  height: 48px;
  .inner {
    width: 1000px;
    margin: 0 auto;
    display: flex;
    height: 100%;
    .nav-left-contents {
      flex: 1;
      display: flex;
      a {
        color: #fff;
        line-height: 48px;
        margin-right: 40px;
      }
    }
    .nav-right-contents {
      > * {
        float: right;
      }
      button.account-thumbnail {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        margin: 8px 0;
      }
    }
  }
}
</style>
