<template>
  <li>
    <md-card>
      <h3>{{ data.title }}</h3>
      <md-divider/>
      <div class="card-footer">
        <span
          :style="data.estimate === null ? { color: '#999' } : {}"
        >
          {{ data.estimate !== null ? data.estimate + ' ' + estimationUnit : '見積り未入力' }}
        </span>
        <span
          v-if="mode === 'default' && (data.isSelectedForSprint || !data.isReady)"
          class="item-status-label"
        >
          {{ data.isSelectedForSprint ? 'This Sprint' : !data.isReady ? 'Not ready' : '' }}
        </span>
        <md-checkbox
          v-if="mode === 'planning'"
          v-model="isChecked"
          @change="$emit('onItemCheck', { 'item': data, 'isChecked': isChecked })"
        />
      </div>
    </md-card>
  </li>
</template>

<script>
export default {
  props: {
    data: Object,
    mode: String,
    estimationUnit: String
  },
  data: function () {
    return {
      isChecked: false
    }
  }
}
</script>

<style scoped lang="scss">
li {
  margin: 0 16px 16px 0;

  .md-card {
    width: 272px;
    height: 152px;
    background-color: #fff;
    margin: 0;
    padding: 8px 0;
    cursor: pointer;
  }

  h3 {
    height: 88px;
    text-align: left;
    margin: 0;
    padding: 0 12px;
  }

  .card-footer {
    padding: 0 12px;
    display: flex;

    span {
      padding: 8px 0;
      flex: 1;

      &.item-status-label {
        background-color: #448aff;
        padding: 2px 8px;
        color: #fff;
        flex: none;
        height: 25px;
        margin: auto;
        border-radius: 4px;
      }
    }

    .md-checkbox {
      width: 24px;
      margin: 8px 0;
    }
  }
}
</style>
