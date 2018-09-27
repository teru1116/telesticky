<template>
  <li
    v-on:click="$router.push({ name: 'productBacklogItemDetail', params: { itemId: item.id } })"
  >
    <md-card>
      <div class="card-body">
        <p>{{ item.title }}</p>
      </div>
      <md-divider/>
      <div class="card-footer">
        <span
          :style="item.estimate === null ? { color: '#999' } : {}"
          class="footer-left-items"
        >
          {{ item.estimate !== null ? item.estimate + ' ' + estimationUnit : '見積り未入力' }}
        </span>
        <span class="footer-right-items">
          <md-checkbox
            v-if="mode === 'planning' || mode === 'change_sprint_item'"
            v-model="checked"
            @change="$emit('onItemCheck', item, checked)"
          />
          <span
            v-if="item.isSelectedForSprint"
            class="item-status-label"
          >
            現在のスプリント
          </span>
        </span>
      </div>
    </md-card>
  </li>
</template>

<script>
export default {
  props: {
    item: Object,
    mode: String,
    estimationUnit: String
  },
  data () {
    return {
      checked: this.item.isSelectedForSprint
    }
  }
}
</script>

<style lang="scss" scoped>
li {
  margin: 0 16px 16px 0;
  .md-card {
    width: 272px;
    height: 152px;
    background-color: #fff;
    cursor: pointer;
    .card-body {
      height: 112px;
      padding: 0 12px;
      p {
        padding: 8px 0;
      }
    }
    .card-footer {
      height: 32px;
      padding: 0 12px;
      span.footer-left-items {
        float: left;
        line-height: 36px;
      }
      span.footer-right-items {
        float: right;
        span.item-status-label {
          float: right;
          background-color: #1ba6dd;
          padding: 2px 8px;
          color: #fff;
          height: 24px;
          margin: 6px auto;
          font-size: 12px;
          border-radius: 4px;
        }
        .md-checkbox {
          float: right;
          width: 24px;
          margin: 8px 0 0 8px;
        }
      }
    }
  }
}
</style>
