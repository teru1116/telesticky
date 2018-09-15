<template>
  <div>

    <!-- header -->
    <div
      class="content-header"
    >
      <h2>プロダクトバックログ</h2>
      <div
        class="header-items"
      >
        <md-button
          @click="showsCreateItemDialog=true"
          class="md-raised md-primary primary-button"
        >
          <md-icon>add</md-icon>
          アイテムを追加
        </md-button>
        <md-button
          @click="onNewSprintButtonClick"
          class="md-raised"
          :disabled="mode === 'planning'"
        >
          新しいスプリント
        </md-button>
        <md-button
          @click="onEditSprintButtonClick"
          class="md-raised"
        >
          スプリントのアイテムを変更
        </md-button>
      </div>
    </div>
    <!-- header -->

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

    <!-- body -->
    <div class="content-body">

      <!-- show items -->
      <div class="pb-items-column">
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
        </div>
      </div>

      <!-- show item detail -->
      <md-dialog
        :md-active.sync="$route.name === 'productBacklogItemDetail'"
        class="large-dialog"
      >
        <router-view
          :item="activeItem"
          :teamId="team.id"
          :estimationUnit="team.estimationUnit"
          :definitionsOfDone="team.definitionsOfDone"
        />
      </md-dialog>

      <!-- add item dialog -->
      <md-dialog
        :md-active.sync="showsCreateItemDialog"
        class="large-dialog"
      >
        <CreateItemDialogContent
          :teamId="team.id"
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
    <!-- body -->

    <!-- planning mode -->
    <ProductBacklogPlanning
      :team="team"
      :selectedItems="selectedItems"
      v-on:cancelPlanning="mode = 'default'"
      v-on:finishPlanning="onFinishPlanning"
      class="planning-modal"
      :class="mode === 'planning' ? 'show' : ''"
    />
    <md-snackbar
      :md-position="'center'"
      :md-duration="4000"
      :md-active.sync="isCorrectlyCreatedSprint"
      md-persistent
    >
      <span>新しいスプリントが開始されました</span>
    </md-snackbar>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
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
    activeItem () {
      const itemId = this.$route.params.itemId
      const items = this.productBacklog.items
      for (let i = 0; i < items.length; i++) {
        let item = items[i]
        if (item.id === itemId) return item
      }
    },
    columnNumber: function () {
      return 0
    }
  },
  methods: {
    ...mapActions({
      move: 'moveItem'
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
    onFinishPlanning: function () {
      this.mode = 'default'
      this.isCorrectlyCreatedSprint = true
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
        'teamId': this.team.id,
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

<style lang="scss" scoped>
.content-body {
  display: flex;              // items-columnとplanning-columnを横並びに
  .pb-items-column {
    flex: 1;                  // 右側のplanning-columnに対して幅可変
    position: relative;       // add button の位置基準
    .pb-items-column-scroll-view {
      overflow: scroll;       // 子要素のカード群をコンテンツとするScrollView
      ol {
        height: calc(100vh - 128px);  // 折り返すためにolに高さの定義が必要
        display: inline-flex;         // 幅が子要素の幅で決まるようinlineのflexを設定, したもののflex-wrapで折り返した分の幅は反映されなかった...
        flex-direction: column;       // 縦方向に並べる
        flex-wrap: wrap;              // 折り返す
        padding: 16px 2px !important; // 幅が子要素に関係ない値になっているので右側のpaddingだけ実質あたっていない. 追々スタイリング方法を考える TODO
      }
    }
  }
}

.planning-modal {
  z-index: 3;
  position: absolute;
  top: 0;
  right: -520px;
  width: 520px;
  min-height: calc(100vh - 48px);
  transition: right 0.3s ease;
  &.show {
    right: 0;
  }
}
</style>
