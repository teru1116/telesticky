import Vuex from 'vuex'
import { shallow, createLocalVue } from 'vue-test-utils'
import TeamList from '@/components/TeamList'
import VueRouter from 'vue-router'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(VueRouter)

// ルーターのモック
const router = new VueRouter(
  [
    { path: '/teams', name: 'teamList', component: TeamList }
  ]
)

// ステートのモック
const mockState = [
  {
    id: '1qazxsw23edcvfr4',
    name: 'Roger Federer',
    restOfItem: 0,
    restOfPoint: 0,
    sprintNumber: 0
  }
]

describe('TeamList.vue', () => {
  // Vuexのモック（プロダクトコード内に$store.dispatchが存在するため、使わなくてもactionsのモックがないとエラーになる）
  let store
  let actions
  beforeEach(() => {
    actions = {
      getTeamList: () => 0,
      getTeam: () => 0
    }
    store = new Vuex.Store({ actions })
  })

  it('ステート"teamList"のチームの数が1の時、セルの数が1個であること', () => {
    const wrapper = shallow(TeamList, {
      propsData: {
        account: {
          uid: '0okmnji98uhbvgy7'
        }
      },
      computed: {
        teamList: () => mockState
      },
      localVue,
      store,
      router
    })

    expect(wrapper.findAll('.team-cell').length).to.equal(1)
  })
})
