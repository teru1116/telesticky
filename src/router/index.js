import Vue from 'vue'
import Router from 'vue-router'
import SignUp from '@/views/SignUp'
import SignIn from '@/views/SignIn'
import Container from '@/views/Container'
import Teams from '@/views/Teams'
import TeamCreate from '@/views/TeamCreate'
import Invited from '@/views/Invited'
import TeamTop from '@/views/TeamTop'
import ProductBacklog from '@/views/ProductBacklog'
import CreateProductBacklogItem from '@/views/CreateProductBacklogItem'
import CreateSprint from '@/views/CreateSprint'
import SprintBacklog from '@/views/SprintBacklog'

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
              component: ProductBacklog,
              children: [
                {
                  path: 'create_item',
                  name: 'CreateProductBacklogItem',
                  component: CreateProductBacklogItem
                },
                {
                  path: 'create_sprint',
                  name: 'CreateSprint',
                  component: CreateSprint
                }
              ]
            },
            {
              path: 'sprint_backlog',
              name: 'SprintBacklog',
              component: SprintBacklog
            }
          ]
        }
      ]
    }
  ]
})
