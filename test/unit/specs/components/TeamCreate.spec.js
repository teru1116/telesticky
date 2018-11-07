import { shallow, createLocalVue } from 'vue-test-utils'
import TeamCreate from '@/pages/TeamCreate'
import Vuex from 'vuex'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('TeamCreate.vue', () => {
  let wrapper
  let store
  let actions

  beforeEach(() => {
    actions = {
      createTeam: sinon.spy()
    }
    store = new Vuex.Store({ actions })

    wrapper = shallow(TeamCreate, {
      propsData: {
        uid: 'wBpA5VBRpYfVd0PNFlw9smblz783'
      },
      localVue,
      store
    })
  })

  it('チーム作成ボタンが押下された時、createTeamアクションをディスパッチしていること', () => {
    wrapper.setData({
      teamName: 'test-team-001',
      members: [],
      sprintDuration: 7,
    })

    wrapper.find('.create-team-button').trigger('click')

    expect(actions.createTeam.args[0][1]).to.deep.equal({
      uid: 'wBpA5VBRpYfVd0PNFlw9smblz783',
      newTeam: {
        teamName: 'test-team-001',
        members: [],
        sprintDuration: 7
      }
    })
  })
})
