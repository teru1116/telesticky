import Vue from 'vue'
import Router from 'vue-router'
import AuthContainer from '@/components/AuthContainer'
import SignedInContainer from '@/components/SignedInContainer'
import SignUp from '@/components/SignUp'
import SignIn from '@/components/SignIn'
import Invited from '@/components/Invited'
import Teams from '@/components/Teams'
import TeamCreate from '@/components/TeamCreate'
import TeamTop from '@/components/TeamTop'
import ProductBacklog from '@/components/ProductBacklog'
import SprintBacklog from '@/components/SprintBacklog'
import Settings from '@/components/TeamSettings'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    // auth
    {
      path: '/auth',
      component: AuthContainer,
      children: [
        {
          path: 'sign_up',
          name: 'signUp',
          component: SignUp
        },
        {
          path: 'sign_in',
          name: 'signIn',
          component: SignIn
        },
        {
          path: 'invited',
          name: 'invited',
          component: Invited
        }
      ]
    },
    // signed in
    {
      path: '/',
      component: SignedInContainer,
      children: [
        {
          path: 'teams',
          name: 'teams',
          component: Teams,
          children: [
            {
              path: 'create',
              name: 'teamCreate',
              component: TeamCreate
            }
          ]
        },
        {
          path: 'teams/:teamId',
          name: 'teamTop',
          component: TeamTop,
          children: [
            {
              path: 'product_backlog',
              name: 'productBacklog',
              component: ProductBacklog
            },
            {
              path: 'sprint_backlog',
              name: 'sprintBacklog',
              component: SprintBacklog
            },
            {
              path: 'team_settings',
              name: 'teamSettings',
              component: Settings
            }
          ]
        }
      ]
    }
  ]
})
