import { shallow, createLocalVue } from 'vue-test-utils'
import TeamList from '@/pages/TeamList'
import Vuex from 'vuex'
import VueRouter from 'vue-router'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(VueRouter)

// ストアの状態のモック
const mockState = [
  {
    id: '1qazxsw23edcvfr4',
    name: 'Roger Federer',
    remainingItem: 32,
    remainingPoint: 60,
    sprintNumber: 6
  }
]

describe('TeamList.vue', () => {
  let wrapper
  let store
  let actions
  let router

  beforeEach(() => {
    actions = {
      getTeamList: sinon.spy(),
      getTeam: sinon.spy()
    }
    store = new Vuex.Store({ actions })

    router = new VueRouter(
      [
        { path: '/teams', name: 'teamList', component: TeamList }
      ]
    )

    wrapper = shallow(TeamList, {
      propsData: {
        account: {
          uid: 'wBpA5VBRpYfVd0PNFlw9smblz783'
        }
      },
      computed: {
        teamList: () => mockState
      },
      localVue,
      store,
      router
    })
  })

  it('store.state.teamListのチームの数が1の時、セルの数が1個であること', () => {
    expect(wrapper.findAll('.team-cell').length).to.equal(1)
  })
  
  it('store.state.teamListのチーム名が、セルに表示されていること', () => {
    expect(wrapper.find('.team-title').text()).to.equal('Roger Federer')
  })

  it('store.state.teamListのイテレーション番号が、セルに表示されていること', () => {
    expect(wrapper.find('.team-sprint-num').text()).to.equal('6')
  })

  it('store.state.teamListの残アイテム数が、セルに表示されていること', () => {
    expect(wrapper.find('.team-remaining-item').text()).to.equal('32')
  })

  it('store.state.teamListの残ポイント数が、セルに表示されていること', () => {
    expect(wrapper.find('.team-remaining-point').text()).to.equal('60')
  })

  it('コンポーネント作成時に、getTeamListアクションをディスパッチしていること', () => {
    expect(actions.getTeamList.args[0][1]).to.equal('wBpA5VBRpYfVd0PNFlw9smblz783')
  })
})
