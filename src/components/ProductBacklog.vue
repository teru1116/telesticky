<template>
  <div>
    <!-- toolbar content -->
    <div class="toolbar-content">
      <h2 :style="menuVisible ? { marginLeft: '0' } : { marginLeft: '48px' }">プロダクトバックログ</h2>
      <div class="pbl-header-right">
        <md-button
          @click="onNewSprintButtonClick"
          :disabled="mode === 'planning'"
        >
          新しいスプリント
        </md-button>
        <md-button
          @click="onEditSprintButtonClick"
        >
          今スプリントのアイテムを変更
        </md-button>
      </div>
    </div>

    <!-- alert -->
    <md-dialog-confirm
      :md-active.sync="showsAlertNewSprint"
      md-title="新しいスプリントを作成します。よろしいですか？"
      md-content="まだ前のスプリント期間が終了していません。<br />スプリント期間は固定であるべきです。<br />本当に新しいスプリントを作成しますか？"
      md-confirm-text="OK"
      md-cancel-text="キャンセル"
      @md-cancel="showsAlertNewSprint = false"
      @md-confirm="startCreatingNewSprint"
    />

    <!-- コンテンツ部 -->
    <div class="main-content-container">

      <!-- show items -->
      <md-content class="pb-items-column md-elevation-1">
        <div class="pb-items-column-scroll-view">
          <draggable
            element="ol"
            v-model="productBacklog.items"
            @end="onItemDragged"
            :options="isUpdating ? { disabled: true } : { disabled: false }"
          >
            <ProductBacklogItem
              v-for="item in productBacklog.items"
              :data="item"
              :estimationUnit="team.estimationUnit"
              :mode="mode"
              :key="item.id"
              v-on:onItemCheck="onItemCheck"
            />
          </draggable>
          <md-button
            @click="showsCreateItemDialog=true"
            class="md-fab md-primary add-button"
          >
            <md-icon>add</md-icon>
          </md-button>
        </div>
      </md-content>

      <!-- planning mode -->
      <md-content
        class="pb-planning-column md-elevation-10"
        :class="mode === 'planning' ? 'show' : ''"
      >
        <ProductBacklogPlanning
          v-if="mode === 'planning'"
          :team="team"
          :selectedItems="selectedItems"
          v-on:cancelPlanning="mode = 'default'"
        />
      </md-content>
      <md-snackbar
        :md-position="'center'"
        :md-duration="4000"
        :md-active.sync="isCorrectlyCreatedSprint"
        md-persistent
      >
        <span>新しいスプリントが開始されました</span>
      </md-snackbar>

      <!-- add item dialog -->
      <md-dialog
        :md-active.sync="showsCreateItemDialog"
      >
        <CreateItemDialogContent
          :estimationUnit="team.estimationUnit"
          :initialItemStatus="team.initialItemStatus"
          :definitionsOfDone="team.definitionsOfDone"
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
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
// util
import util from '@/utils'
// components
import draggable from 'vuedraggable'
import ProductBacklogItem from './ProductBacklogItem'
import ProductBacklogPlanning from './ProductBacklogPlanning'
import CreateItemDialogContent from './CreateItemDialogContent'

export default {
  props: {
    sprint: Object,
    productBacklog: Object,
    team: Object,
    menuVisible: Boolean
  },
  data: function () {
    return {
      mode: 'default', // default/planning/sprint_update
      isUpdating: false,
      showsAlertNewSprint: false,
      showsCreateItemDialog: false,
      isCorrectlyAdded: false,
      selectedItems: [],
      isCorrectlyCreatedSprint: false
    }
  },
  components: {
    draggable,
    ProductBacklogItem,
    ProductBacklogPlanning,
    CreateItemDialogContent
  },
  computed: {
    columnNumber: function () {
      return 0
    }
  },
  methods: {
    ...mapActions({
      move: 'moveItem',
      startSprint: 'createAndStartSprint'
    }),
    onNewSprintButtonClick: function () {
      this.startCreatingNewSprint()
      // const today = new Date()
      // if (this.sprint && !util.isLater(today, this.sprint.endDate)) {
      //   this.showsAlertNewSprint = true
      // } else {
      //   this.startCreatingNewSprint()
      // }
    },
    startCreatingNewSprint: function () {
      this.mode = 'planning'
    },
    onEditSprintButtonClick: function () {
      this.isSelectionMode = !this.isSelectionMode
    },
    onItemDragged: function (event) {
      if (event.type !== 'end') return
      const newIndex = event.newIndex
      const oldIndex = event.oldIndex
      if (newIndex === oldIndex) return

      // 移動したアイテム
      const movedItem = this.productBacklog.items[newIndex]
      // 優先度を上げたか下げたか（orderの数値が下がっていれば優先度が上げられたことになる）
      const isRaised = (newIndex < oldIndex)
      // アイテムの移動に伴って位置が変わる全てのアイテム
      const relatedItems = isRaised ? this.productBacklog.items.slice(newIndex, oldIndex + 1) : this.productBacklog.items.slice(oldIndex, newIndex + 1)
      // order更新処理開始
      this.move({
        'movedItem': movedItem,
        'newIndex': newIndex,
        'oldIndex': oldIndex,
        'isRaised': isRaised,
        'relatedItems': relatedItems
      })
    },
    onCreateItemFinish: function () {
      this.showsCreateItemDialog = false
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
    },
    onCreateSprintFinish: function () {
      this.showsCreateSprintDialog = false
      this.isCorrectlyCreatedSprint = true
    }
  }
}
</script>

<style scoped lang="scss">
.main-content-container {
  display: flex;              // items-columnとplanning-columnを横並びに
  height: calc(100vh - 64px); // viewportからtool-barを引いた高さ

  .pb-items-column {
    flex: 1;                  // 右側のplanning-columnに対して幅可変
    position: relative;       // add button の位置基準

    .pb-items-column-scroll-view {
      overflow: scroll;       // 子要素のカード群をコンテンツとするScrollView

      ol {
        height: calc(100vh - 64px);   // viewportからtool-barを引いた高さ
        display: inline-flex;         // 幅が子要素の幅で決まるようinlineのflexを設定, したもののflex-wrapで折り返した分の幅は反映されなかった...
        flex-direction: column;       // 縦方向に並べる
        flex-wrap: wrap;              // 折り返す
        padding: 16px!important;      // 幅が子要素に関係ない値になっているので右側のpaddingだけ実質あたっていない. 追々スタイリング方法を考える TODO
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
  }

  .pb-planning-column {
    width: 0;
    padding: 0;
    z-index: 10;

    &.show {
      width: 380px;
      padding: 16px;
    }
  }
}
</style>
