<template>
  <li>
    <md-card>
      <h3>
        {{ data.title }}
      </h3>
      <md-divider></md-divider>
      <div
        class="card-footer"
      >
        <span>
          {{ data.estimate + ' ' + estimationUnit }}
        </span>
        <md-checkbox
          v-if="isSelectionMode"
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
    estimationUnit: String,
    isSelectionMode: Boolean
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
    }

    .md-checkbox {
      width: 24px;
      margin: 8px 0;
    }
  }
}
</style>
