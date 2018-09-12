<template>
  <md-card>
    <div
      class="actions"
    >
      <md-button
        class="md-primary cancel-button"
        @click="$emit('cancelPlanning')"
      >
        キャンセル
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
          開発チームの予想キャパシティと実績をもとに、スプリントで何ができるかを予想します。
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
        <md-field>
          <label>スプリントゴール</label>
          <md-textarea
            v-model="sprintGoal"
            md-autogrow
          />
        </md-field>
      </md-step>

      <!-- step 3 -->
      <md-step
        id="third"
        md-label="スプリントの開始"
      >
        <md-datepicker
          v-model="startDate"
        />
        <md-datepicker
          v-model="endDate"
        />
        <md-button
          class="md-raised md-primary button-start-sprint"
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
  }
}
</script>

<style scoped lang="scss">
.actions {
  overflow: hidden;

  .cancel-button {
    float: right;
  }
}

dl {
  dt {
    float: left;
    clear: both;
    width: 224px;
    font-weight: 600;
  }

  dt, dd {
    padding: 8px 0;
  }
}

.button-start-sprint {
  margin: 40px 0 0;
}
</style>
