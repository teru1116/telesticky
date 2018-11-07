import productBacklog from '@/api/productBacklog'
import firebase from '@/firebase'

describe('API - productBacklog', () => {
  // テストアカウントでサインイン
  before(async () => {
    await firebase.auth().signInWithEmailAndPassword('testaccount@rto.com', '1qazxsw2')
  })

  it('アイテムを追加した後、アイテム一覧を取得すると、追加したアイテムが含まれていること', async () => {
    // スタブ
    const teamId = ''
    const title = `test-item-${Math.ceil(Math.random() * 100)}`
    const newItem = {
      title,
      estimate: 2,
      description: '',
      value: '',
      definitionsOfItemDone: [],
      status: 0
    }

    // アイテムを追加する
    await productBacklog.addItem(teamId, newItem)

    // アイテム一覧を取得する
    const items = await productBacklog.getItems(teamId)

    // アイテム一覧の先頭のアイテム名が、追加したアイテム名と同じであれば合格
    expect(items[0].title).to.equal(title)
  })

  it('2番目のアイテムを5番目に移動させた時、3番目は2番目に、4番目は3番目に移動していること', () => {
    //
  })

  

  // サインアウト
  after(() => {
    firebase.auth().signOut()
  })
})
