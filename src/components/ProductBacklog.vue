<template>
  <div>
    <div
      class="dummy-toolbar"
    >
      <h2
        :style="menuVisible ? { marginLeft: '0' } : { marginLeft: '48px' }"
      >
        プロダクトバックログ
      </h2>
      <div
        class="pbl-header-right"
      >
        <md-button
          @click="startSprintPlanning"
        >
          {{ isSelectionMode ? 'キャンセル' : 'スプリントに追加' }}
        </md-button>
      </div>
    </div>
    <div
      class="pb-content"
    >
      <md-content
        class="pb-items-column md-elevation-1"
      >
        <draggable
          element="ol"
          v-model="productBacklog.items"
          @end="onItemDragged"
          :options="isUpdating ? {disabled: true} : {disabled: false}"
        >
          <ProductBacklogItem
            v-for="item in productBacklog.items"
            :data="item"
            :estimationUnit="teamRules.estimationUnit"
            :isSelectionMode="isSelectionMode"
            :key="item.id"
            v-on:onItemCheck="onItemCheck"
          />
        </draggable>
        <md-button
          @click="showDialog=true"
          class="md-fab md-primary add-button"
        >
          <md-icon>
            add
          </md-icon>
        </md-button>
      </md-content>
      <md-dialog
        :md-active.sync="showDialog"
      >
        <CreateItemDialogContent
          :estimationUnit="teamRules.estimationUnit"
          :initialItemStatus="teamRules.initialItemStatus"
          :definitionsOfDone="teamRules.definitionsOfDone"
          :selectedItems="selectedItems"
          v-on:onCreateItemFinish="onCreateItemFinish"
        />
      </md-dialog>
      <md-snackbar
        :md-position="'center'"
        :md-duration="4000"
        :md-active.sync="isCorrectlyAdded"
        md-persistent
      >
        <span>プロダクトバックログにアイテムが追加されました</span>
      </md-snackbar>
      <md-content
        class="pb-planning-column md-elevation-10"
        :class="isSelectionMode ? 'show' : ''"
      >
        <div
          v-if="isSelectionMode"
        >
          <p>
            スプリントで届けるプロダクトバックログアイテムを選択します。<br />
            選択し終えたら、スプリントバックログ画面で、より詳細な計画づくりをします。
          </p>
          <dl>
            <dt>選択中のアイテム数</dt>
            <dd>{{ selectedItems.length }} 個</dd>
            <dt>選択中のアイテムの見積り値合計</dt>
            <dd>{{ selectedTotalEstimate + ' ' + teamRules.estimationUnit }}</dd>
          </dl>
          <div
            class="planning-actions"
          >
            <md-button class="md-raised">
              今スプリントのアイテムを変更する
            </md-button>
            <md-button
              class="md-raised md-primary"
              @click="$router.push('product_backlog/create_sprint')"
            >
              新しいスプリントを開始する
            </md-button>
          </div>
        </div>
      </md-content>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
// components
import draggable from 'vuedraggable'
import ProductBacklogItem from './../components/ProductBacklogItem'
import CreateProductBacklogItem from './../components/CreateProductBacklogItem'

export default {
  props: {
    sprint: Object,
    productBacklog: Object,
    teamRules: Object,
    menuVisible: Boolean
  },
  data: function () {
    return {
      isUpdating: false,
      showDialog: false,
      isSelectionMode: false,
      selectedItems: [],
      isCorrectlyAdded: false
    }
  },
  components: {
    'draggable': draggable,
    'ProductBacklogItem': ProductBacklogItem,
    'CreateItemDialogContent': CreateProductBacklogItem
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
  methods: {
    ...mapActions({
      move: 'moveItem',
      startSprint: 'createAndStartSprint'
    }),
    startSprintPlanning: function () {
      this.isSelectionMode = !this.isSelectionMode
    },
    onItemDragged: function (event) {
      if (event.type !== 'end') return
      const newIndex = event.newIndex
      const oldIndex = event.oldIndex
      if (newIndex === oldIndex) return

      // 移動したアイテム
      const movedItem = this.productBacklog[newIndex]
      // 優先度を上げたか下げたか（orderの数値が下がっていれば優先度が上げられたことになる）
      const isRaised = (newIndex < oldIndex)
      // アイテムの移動に伴って位置が変わる全てのアイテム
      const relatedItems = isRaised ? this.productBacklog.items.slice(newIndex, oldIndex + 1) : this.productBacklog.items.slice(oldIndex, newIndex + 1)
      // order更新処理開始
      this.move({
        'movedItem': movedItem,
        'newIndex': newIndex,
        'isRaised': isRaised,
        'relatedItems': relatedItems
      })
    },
    onCreateItemFinish: function () {
      this.showDialog = false
      this.isCorrectlyAdded = true
    },
    onItemCheck: function (param) {
      const item = param.item
      const isChecked = param.isChecked
      if (isChecked) {
        this.selectedItems.push(item)
      } else {
        for (let i = 0; i < this.selectedItems.length; i++) {
          if (item === this.selectedItems[i]) {
            this.selectedItems.splice(i, 1)
            break
          }
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
.dummy-toolbar {
  h2 {
    z-index: 2;
    font-size: 20px;
    text-align: left;
    color: #fff;
  }

  .pbl-header-right {
    flex: 1;

    .md-button {
      color: #444;
      background-color: #fff;
      float: right;
      margin: 8px 0 0 8px;
      z-index: 2;
    }
  }
}

.pb-content {
  display: flex;
  height: calc(100vh - 58px);

  .pb-items-column {
    flex: 1;
    padding: 24px 16px 0;
    position: relative;

    ol {
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
      align-content: baseline;
      height: 560px;
      margin: 32px 0 0;
      padding: 0;
      position: relative;
    }

    .md-button.add-button {
      position: absolute;
      bottom: 24px;
      right: 24px;
      z-index: 999;
      background-color: var(--md-theme-demo-light-accent,#ff5252)!important;

      .md-icon {
        color: #fff;
      }
    }
  }

  .pb-planning-column {
    width: 0;
    padding: 0;
    z-index: 10;

    &.show {
      width: 320px;
      padding: 16px;
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

    .planning-actions {
      margin-top: 40px;
      text-align: center;

      .md-button {
        width: 240px;
        margin: 0 auto 16px;
      }
    }
  }
}
</style>
