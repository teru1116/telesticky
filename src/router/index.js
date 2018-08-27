import Vue from 'vue'
import Router from 'vue-router'
import SignUp from '@/components/SignUp'
import SignIn from '@/components/SignIn'
import Container from '@/components/Container'
import Teams from '@/components/Teams'
import TeamCreate from '@/components/TeamCreate'
import Invited from '@/components/Invited'
import TeamTop from '@/components/TeamTop'
import ProductBacklog from '@/components/ProductBacklog'
import SprintBacklog from '@/components/SprintBacklog'
import Settings from '@/components/TeamSettings'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/sign_up',
      name: 'SignUp',
      component: SignUp
    },
    {
      path: '/sign_in',
      name: 'SignIn',
      component: SignIn
    },
    {
      path: '/',
      name: 'Container',
      component: Container,
      children: [
        {
          path: 'teams',
          name: 'Teams',
          component: Teams,
          children: [
            {
              path: 'create',
              name: 'TeamCreate',
              component: TeamCreate
            }
          ]
        },
        {
          path: 'invited',
          name: 'Invited',
          component: Invited
        },
        {
          path: 'teams/:teamId',
          name: 'TeamTop',
          component: TeamTop,
          children: [
            {
              path: 'product_backlog',
              name: 'ProductBacklog',
              component: ProductBacklog
            },
            {
              path: 'sprint_backlog',
              name: 'SprintBacklog',
              component: SprintBacklog
            },
            {
              path: 'team_settings',
              name: 'TeamSettings',
              component: Settings
            }
          ]
        }
      ]
    }
  ]
})
