<template>
  <md-card>
    <div class="planning-modal-header">
      <h2>
        スプリントプランニング
      </h2>
      <md-button
        class="close-planning-modal"
        @click="$emit('cancelPlanning')"
      >
        <md-icon>clear</md-icon>
      </md-button>
    </div>

    <md-steppers
      md-vertical
    >

      <!-- step 1 -->
      <md-step
        id="first"
        md-label="スプリントで開発する機能の予想"
      >
        <p>
          今スプリントで開発するアイテムを選択しましょう。<br />
          開発チームの予想キャパシティや実績をもとに、<br />
          スプリントで何ができるかを予想します。
        </p>
        <dl>
          <dt>選択中のアイテム数</dt>
          <dd>{{ selectedItems.length }} 個</dd>
          <dt>選択中のアイテムの見積り値合計</dt>
          <dd>{{ selectedTotalEstimate + ' ' + team.estimationUnit }}</dd>
        </dl>
      </md-step>

      <!-- step 2 -->
      <md-step
        id="second"
        md-label="スプリントゴールの設定"
      >
        <p>
          スプリントゴールとは、プロダクトバックログを実装することで実現するスプリントの目的であり、
          開発チームがインクリメントを開発する指針となるものです。
        </p>
        <div class="textarea-wrapper">
          <textarea
            v-model="sprintGoal"
            rows="2"
          />
        </div>
      </md-step>

      <!-- step 3 -->
      <md-step
        id="third"
        md-label="スプリントの開始"
      >
        <ul
          class="date-pickers"
        >
          <li>
            <label>
              スプリント開始日
            </label>
            <Datepicker
              :value="startDate"
              format="M月dd日"
            />
          </li>
          <li>
            <label>
              スプリント終了日
            </label>
            <Datepicker
              :value="endDate"
              format="M月dd日"
            />
          </li>
        </ul>
        <md-button
          class="md-raised md-primary start-sprint"
          @click="onStartSprintButtonClick"
        >
          新しいスプリントを開始する
        </md-button>
      </md-step>
    </md-steppers>
  </md-card>
</template>

<script>
import { mapActions } from 'vuex'
import Datepicker from 'vuejs-datepicker'

export default {
  props: {
    team: Object,
    selectedItems: Array
  },
  computed: {
    selectedTotalEstimate: function () {
      let total = 0
      this.selectedItems.forEach(item => {
        total += item.estimate
      })
      return total
    }
  },
  data: function () {
    return {
      sprintGoal: '',
      startDate: new Date(),
      // FIXME: [Vue Warn] expected Date, got Number
      endDate: new Date().setDate(new Date().getDate() + this.team.sprintDuration)
    }
  },
  methods: {
    ...mapActions([
      'createAndStartSprint'
    ]),
    onStartSprintButtonClick: function () {
      this.createAndStartSprint({
        'teamId': this.team.id,
        'newSprint': {
          'sprintNumber': this.team.totalSprintCount + 1,
          'startDate': this.startDate,
          'endDate': this.endDate,
          'sprintGoal': this.sprintGoal,
          'items': this.selectedItems
        }
      })
        .then(() => {
          this.$emit('onFinishPlanning')
        })
    }
  },
  components: {
    Datepicker
  }
}
</script>

<style scoped lang="scss">
.planning-modal-header {
  height: 48px;
  margin: 8px 0 0;
  padding: 0 24px;
  h2 {
    float: left;
    line-height: 48px;
    font-size: 20px;
  }
  button.close-planning-modal {
    float: right;
    color: #666;
    min-width: 44px;
    height: 44px;
  }
}
.md-stepper {
  dl {
    margin: 8px 0 0;
    dt {
      float: left;
      clear: both;
      width: 224px;
      color: #666;
      font-weight: 600;
      font-size: 14px;
    }
    dt, dd {
      padding: 4px 0;
    }
  }
  .textarea-wrapper {
    margin: 16px 0 0;
    textarea {
      width: 100%;
      max-width: 100%;
      min-width: 100%;
    }
  }
  ul.date-pickers {
    li {
      display: flex;
      label {
        color: #666;
        font-weight: 600;
        font-size: 14px;
        line-height: 32px;
        margin-right: 16px;
      }
      .vdp-datepicker {
        margin-bottom: 8px;
      }
    }
  }
}
.md-button {
  &.start-sprint {
    background-color: #7b68ee!important;
    margin: 40px 0 0;
  }
}
</style>
