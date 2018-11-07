/* eslint-disable no-webpack-loader-syntax */
const teamListInjector = require('inject-loader!@/store/modules/teamList')

const mockResponse = [
  {
    id: '1qazxsw23edcvfr4',
    name: 'Roger Federer',
    remainingItem: 32,
    remainingPoint: 60,
    sprintNumber: 6
  }
]

// モック化された依存関係が注入されたテスト対象を生成
const teamList = teamListInjector({
  '@/api/teamList': {
    async get (uid) {
      return mockResponse
    },
    async createTeam (uid, team) {
      return mockResponse
    }
  }
})

describe('Vuex - teamList', () => {
  let uid
  let commit
  beforeEach(() => {
    uid = 'wBpA5VBRpYfVd0PNFlw9smblz783'
    commit = sinon.spy()
  })

  it('アクション"getTeamList"が、ミューテーション"setTeamList"を呼び出していること', async () => {
    await teamList.actions.getTeamList({ commit }, uid)

    expect(commit.args).to.deep.equal([
      ['setTeamList', mockResponse]
    ])
  })

  it('アクション"createTeam"が、ミューテーション"setTeamList"を呼び出していること', async () => {
    const payload = {
      uid,
      newTeam: {
        teamName: '1qazxsw2',
        sprintDuration: 7,
        members: []
      }
    }

    await teamList.actions.createTeam({ commit }, payload)

    expect(commit.args).to.deep.equal([
      ['setTeamList', mockResponse]
    ])
  })

  it('ミューテーション"setTeamList"の結果、状態が更新されていること', () => {
    const state = []
    const payload = [
      {
        id: '1qazxsw23edcvfr4',
        name: 'Roger Federer',
        remainingItem: 32,
        remainingPoint: 60,
        sprintNumber: 6
      }
    ]

    teamList.mutations.setTeamList(state, payload)

    expect(state).to.deep.equal(payload)
  })
})
