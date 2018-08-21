<template>
  <li>
    <md-card>
      <h3>
        {{ data.title }}
      </h3>
      <div
        class="card-footer"
      >
        <p>{{ data.estimate + ' ' + estimationUnit}}</p>
        <md-field>
          <md-select
            v-model="status"
            md-selected="onStatusChanged"
          >
            <md-option
              v-for="(statusName, status) in itemStatusList"
              :value="status"
              :key="status"
            >
              {{ statusName }}
            </md-option>
          </md-select>
        </md-field>
      </div>
    </md-card>
  </li>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  props: {
    data: Object,
    estimationUnit: String,
    itemStatusList: Array,
    activeSprintId: String
  },
  data: function () {
    return {
      status: this.data.status
    }
  },
  methods: {
    onStatusChanged: function () {
      this.changeStatus({
        'sprintId': this.activeSprintId,
        'itemId': this.data.id,
        'status': this.status
      })
    },
    ...mapActions({
      changeStatus: 'changeStatusProductBacklogItem'
    })
  }
}
</script>

<style scoped lang="scss">
li {
  .md-card {
    width: 160px;
    height: 132px;
    background-color: #fff;
    margin: 0 0 8px;
    padding: 4px 0;
    cursor: pointer;
  }

  h3 {
    font-size: 12px!important;
    margin: 0!important;
    height: 96px;
    text-align: left;
    margin: 0;
    padding: 0 12px;
  }

  .card-footer {
    border-top: 1px solid rgba(0,0,0,.12);
    padding: 0 12px;
    display: flex;

    p {
      width: 48px;
      line-height: 30px;
      font-size: 12px!important;
      font-weight: 400!important;
      margin: 2px 0 0;
    }

    .md-field {
      width: 88px;
      margin: -16px 0 0;

      .md-select {
        .md-input {
          font-family: inherit;
          font-size: 90%;
        }
      }
    }
  }
}
</style>
