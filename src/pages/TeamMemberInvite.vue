<template>
  <div class="dialog-content">
    <div class="dialog-header">
      <h2>メンバーを招待する</h2>
      <md-button
        @click="$router.push({ name: 'members' })"
        class="close-modal"
      >
        <md-icon>clear</md-icon>
      </md-button>
    </div>

    <md-dialog-content>
      <div class="dialog-content-inner">
        <p>プロジェクトに招待したい方のメールアドレスを入力してください。</p>
        <input
          v-model="inviteEmail"
          type="text"
          class="large"
          placeholder="メールアドレスを入力"
        />
      </div>

      <md-dialog-actions>
        <md-button
          class="md-raised md-primary primary-button"
          @click="submit"
        >
          招待する
        </md-button>
      </md-dialog-actions>
    </md-dialog-content>

  </div>
</template>

<script>
import { mapActions } from 'vuex'
// components
import ListedTextarea from '@/components/ListedTextarea'

export default {
  props: {
    teamId: String
  },
  data () {
    return {
      inviteEmail: '',
      updating: false
    }
  },
  methods: {
    ...mapActions([
      'addMember'
    ]),
    submit () {
      this.updating = true

      this.addMember({
        teamId: this.teamId,
        email: this.inviteEmail
      })
        .then(() => {
          //
        })
        .catch(error => {
          console.error(error)
        })
        .finally(() => {
          this.updating = false
        })
    }
  },
  components: {
    ListedTextarea
  }
}
</script>

<style lang="scss" scoped>
.dialog-content {
  width: 640px;
  .dialog-header {
    padding: 4px 8px;
    h2 {
      display: inline-block;
    }
    .md-button {
      &.close-modal {
        float: right;
        min-width: 44px;
        background-color: rgba(0, 0, 0, 0);
        .md-icon {
          color: #fff;
        }
      }
    }
  }
  .md-dialog-content {
    max-height: calc(80vh - 48px);
    overflow-y: auto;
    padding: 0;
    .dialog-content-inner {
      padding: 16px 24px 72px;
    }
    .md-dialog-actions {
      position: fixed;
      bottom: 0;
      height: 48px;
      width: 100%;
      padding: 0 24px;
      border-top: 1px solid rgba(0,0,0,0.12);
      background-color: #fff;
      z-index: 15;
    }
  }
}
</style>
