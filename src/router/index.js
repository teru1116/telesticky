import Vue from 'vue'
import Router from 'vue-router'
import SignUp from '@/views/SignUp'
import SignIn from '@/views/SignIn'
import Container from '@/views/Container'
import Teams from '@/views/Teams'
import TeamTop from '@/views/TeamTop'
import ProductBacklog from '@/views/ProductBacklog'
import ProductBacklogCreate from '@/views/ProductBacklogCreate'

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
          component: Teams
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
                  path: 'create',
                  name: 'ProductBacklogCreate',
                  component: ProductBacklogCreate
                }
              ]
            }
          ]
        }
      ]
    }
  ]
})
