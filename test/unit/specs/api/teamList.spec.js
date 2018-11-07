import teamList from '@/api/teamList'
import firebase from '@/firebase'

describe('API - teamList', () => {
  // テストアカウントでサインイン
  let uid
  before(async () => {
    const userCredential = await firebase.auth().signInWithEmailAndPassword('testaccount@rto.com', '1qazxsw2')
    uid = userCredential.user.uid
  })

  it('新規チーム作成（メンバー招待無し）を実行すると、作成したチームが返り値に含まれていること', async () => {
    const teamName = `test-team-${Math.ceil(Math.random() * 100)}`
    // スタブ
    const team = {
      teamName,
      sprintDuration: 7,
      members: []
    }
    // チーム作成実行
    const teams = await teamList.createTeam(uid, team)

    // スタブで渡したチームが、返り値の最初のチームと一致していれば合格
    expect(teams[0]).to.have.property('name', teamName)
  })

  it('チーム一覧取得を実行すると、以前作成したチームが返り値に含まれていること', async () => {
    const teamName = `test-team-${Math.ceil(Math.random() * 100)}`
    // スタブ
    const team = {
      teamName,
      sprintDuration: 7,
      members: []
    }
    // チーム作成実行
    await teamList.createTeam(uid, team)
    
    // チーム一覧取得実行
    const teams = await teamList.get(uid)

    // 作成したチームが一覧に含まれていれば合格
    expect(teams[0]).to.have.property('name', teamName)
  })

  // サインアウト
  after(() => {
    firebase.auth().signOut()
  })
})
