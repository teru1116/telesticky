<template>
  <div>

    <!-- header -->
    <div class="content-header">
      <h2>バックログ</h2>
      <div class="header-items">
        <md-button
          @click="$router.push({ name: 'productBacklogItemCreate' })"
          class="md-raised md-primary primary-button"
          :disabled="mode !== 'default'"
        >
          <md-icon>add</md-icon>
          アイテムを追加
        </md-button>
        <md-button
          @click="onStartSprintButtonClick"
          class="md-raised"
          :disabled="mode !== 'default'"
        >
          イテレーションを開始
        </md-button>
        <md-button
          @click="mode = 'change_sprint_item'"
          class="md-raised"
          :disabled="mode !== 'default' || !sprint.id"
        >
          イテレーションのアイテムを変更
        </md-button>
      </div>
    </div>
    <!-- header -->

    <!-- body -->
    <div class="content-body">

      <!-- アイテム一覧 -->
      <div class="pb-items-column">
        <div class="pb-items-column-scroll-view">
          <Draggable
            element="ol"
            v-model="productBacklog.items"
            @end="onItemDragEnd"
            :options="orderUpdating ? { disabled: true } : { disabled: false }"
          >
            <ProductBacklogItem
              v-for="item in productBacklog.items"
              :key="item.id"
              :item="item"
              :mode="mode"
              :estimationUnit="team.estimationUnit"
              v-on:onItemCheck="onItemCheck"
            />
          </draggable>
        </div>
      </div>
    </div>
    <!-- body -->

    <!-- スライドビュー: 新しいスプリント -->
    <md-dialog-alert
      :md-active.sync="showsAlertStartSprint"
      md-content="まだ前のスプリントが終了されていません。<br />スプリントを終了してから、新しいスプリントを開始して下さい。"
    />
    <ProductBacklogPlanning
      :team="team"
      :selectedItems="selectedItems"
      :class="mode === 'planning' ? 'show' : ''"
      class="modal"
      v-on:close="mode = 'default'"
      v-on:startSprintSucceeded="onStartSprintSucceeded"
      v-on:startSprintFailed="onStartSprintFailed"
    />

    <!-- スライドビュー: スプリントのアイテムを変更 -->
    <ProductBacklogChangeSprintItem
      :team="team"
      :selectedItems="selectedItems"
      :checkedItems="checkedItems"
      :uncheckedItems="uncheckedItems"
      v-on:close="mode = 'default'"
      v-on:changeSprintItemSucceeded="onChangeSprintItemSucceeded"
      v-on:changeSprintItemFailed="onChangeSprintItemFailed"
      :class="mode === 'change_sprint_item' ? 'show' : ''"
      class="modal"
    />

    <!-- アイテム詳細モーダル -->
    <md-dialog
      :md-active="$route.name === 'productBacklogItemDetail'"
      :md-click-outside-to-close="false"
      class="large-dialog"
    >
      <router-view
        :item="activeItem"
        :teamId="team.id"
        :estimationUnit="team.estimationUnit"
        :definitionsOfDone="team.definitionsOfDone"
        v-on:updateItemSucceeded="onUpdateItemSucceeded"
        v-on:updateItemFailed="onUpdateItemFailed"
        v-on:deleteItemSucceeded="onDeleteItemSucceeded"
      />
    </md-dialog>

    <!-- アイテム追加モーダル -->
    <md-dialog
      :md-active="$route.name === 'productBacklogItemCreate'"
      class="large-dialog"
    >
      <router-view
        :teamId="team.id"
        :estimationUnit="team.estimationUnit"
        :initialItemStatus="team.initialItemStatus"
        :definitionsOfDone="team.definitionsOfDone"
        :selectedItems="selectedItems"
        v-on:createItemSucceeded="onCreateItemSucceeded"
        v-on:createItemFailed="onCreateItemFailed"
      />
    </md-dialog>

    <!-- トースト -->
    <md-snackbar
      :md-position="'center'"
      :md-duration="4000"
      :md-active.sync="showsSnackbar"
      md-persistent
    >
      <span>{{ snackbarMessage }}</span>
    </md-snackbar>
  </div>
</template>

<script>
import Draggable from 'vuedraggable'
import ProductBacklogItem from '@/components/ProductBacklogItem'
import ProductBacklogPlanning from '@/components/ProductBacklogPlanning'
import ProductBacklogChangeSprintItem from '@/components/ProductBacklogChangeSprintItem'

export default {
  props: {
    sprint: Object,
    productBacklog: Object,
    team: Object,
    menuVisible: Boolean
  },
  data () {
    return {
      mode: 'default', // default, planning, change_sprint_item
      checkedItems: [],
      uncheckedItems: [],
      orderUpdating: false,
      showsSnackbar: false,
      snackbarMessage: '',
      showsAlertStartSprint: false
    }
  },
  computed: {
    sprintItems () {
      return this.productBacklog.items.filter(item => item.isSelectedForSprint)
    },
    selectedItems () {
      return this.sprintItems.concat(this.checkedItems).filter(item => this.uncheckedItems.indexOf(item) === -1)
    },
    activeItem () {
      const itemId = this.$route.params.itemId
      const items = this.productBacklog.items
      for (let i = 0; i < items.length; i++) {
        let item = items[i]
        if (item.id === itemId) return item
      }
    }
  },
  methods: {
    // 新しいスプリントを開始するボタン クリック時
    onStartSprintButtonClick () {
      // 前のスプリントが続いている場合は、先に終了するようユーザーに伝える
      if (this.sprint.id) {
        this.showsAlertStartSprint = true
      } else {
        this.mode = 'planning'
      }
    },
    // スプリントを開始する: 成功時処理
    onStartSprintSucceeded () {
      this.checkedItems = []
      this.uncheckedItems = []
      this.mode = 'default'
      this.showSnackbar('新しいイテレーションが開始されました。')
    },
    // スプリントを開始する: 失敗時処理
    onStartSprintFailed (error) {
      this.checkedItems = []
      this.uncheckedItems = []
      this.mode = 'default'
      this.showSnackbar('エラー：新しいイテレーションの開始に失敗しました。')
      console.error(error)
    },
    // アイテムを追加する: 成功時処理
    onCreateItemSucceeded () {
      this.showSnackbar('新しいアイテムを追加しました。')
    },
    // アイテムを追加する: 失敗時処理
    onCreateItemFailed (error) {
      this.showSnackbar('エラー：新しいアイテムの作成に失敗しました。')
      console.error(error)
    },
    // アイテム 変更を保存: 成功時処理
    onUpdateItemSucceeded () {
      this.showSnackbar('アイテムの情報を更新しました。')
    },
    // アイテム 変更を保存: 失敗時処理
    onUpdateItemFailed (error) {
      this.showSnackbar('エラー：アイテムの更新に失敗しました。')
      console.error(error)
    },
    // アイテムを削除: 成功時処理（成功時はモーダルを破棄しているため、親であるこのコンポーネントで処理）
    onDeleteItemSucceeded () {
      this.showSnackbar('アイテムを削除しました。')
    },
    // スプリントのアイテムを変更: 成功時処理
    onChangeSprintItemSucceeded () {
      this.checkedItems = []
      this.uncheckedItems = []
      this.mode = 'default'
      this.showSnackbar('イテレーションのアイテムを変更しました。')
    },
    // スプリントのアイテムを変更: 失敗時処理
    onChangeSprintItemFailed (error) {
      this.checkedItems = []
      this.uncheckedItems = []
      this.mode = 'default'
      this.showSnackbar('エラー：イテレーションのアイテムの変更に失敗しました。')
      console.error(error)
    },
    // アイテム選択時
    onItemCheck (item, checked) {
      if (checked) {
        this.uncheckedItems.splice(this.uncheckedItems.indexOf(item), 1)
        // スプリントアイテムでない場合は、checkedリストに追加
        if (!item.isSelectedForSprint) {
          this.checkedItems.push(item)
        }
      } else {
        this.checkedItems.splice(this.checkedItems.indexOf(item), 1)
        // スプリントアイテムの場合は、uncheckedリストに追加
        if (item.isSelectedForSprint) {
          this.uncheckedItems.push(item)
        }
      }
    },
    // アイテム移動完了時（順番並び替え時）
    onItemDragEnd (event) {
      if (event.type !== 'end') return
      const newIndex = event.newIndex
      const oldIndex = event.oldIndex
      if (newIndex === oldIndex) return

      // 優先度を上げたか下げたか（orderの数値が下がっていれば優先度が上げられたことになる）
      const isRaised = (newIndex < oldIndex)
      // 移動したアイテム
      const movedItem = this.productBacklog.items[newIndex]
      // アイテムの移動に伴って位置が変わる全てのアイテム
      const sandwichedItems = isRaised ? this.productBacklog.items.slice(newIndex, oldIndex + 1) : this.productBacklog.items.slice(oldIndex, newIndex + 1)

      this.orderUpdating = false

      this.$store.dispatch('moveItem', { teamId: this.team.id, movedItem, newIndex, oldIndex, isRaised, sandwichedItems })
        .catch(error => {
          this.showSnackbar('エラー：アイテムの移動に失敗しました。')
          console.error(error)
        })
        .finally(() => {
          this.orderUpdating = true
        })
    },
    showSnackbar (message) {
      this.showsSnackbar = true
      this.snackbarMessage = message
    }
  },
  components: {
    Draggable,
    ProductBacklogItem,
    ProductBacklogPlanning,
    ProductBacklogChangeSprintItem
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
.modal {
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
