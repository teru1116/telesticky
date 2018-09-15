import Vue from 'vue'
import Router from 'vue-router'
import firebase from '@/firebase'
import store from '@/store'
// components
import AuthPageContainer from '@/components/AuthContainer'
import Container from '@/components/SignedInPageContainer'
import SignUp from '@/components/SignUp'
import SignIn from '@/components/SignIn'
import Invited from '@/components/Invited'
import TeamList from '@/components/TeamList'
import TeamCreate from '@/components/TeamCreate'
import teamPageContainer from '@/components/TeamTop'
import ProductBacklog from '@/components/ProductBacklog'
import ProductBacklogItemCreate from '@/components/ProductBacklogItemCreate'
import ProductBacklogItemDetail from '@/components/ProductBacklogItemDetail'
import SprintBacklog from '@/components/SprintBacklog'
import Settings from '@/components/TeamSettings'
import Members from '@/components/TeamMembers'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    // auth
    {
      path: '/auth',
      component: AuthPageContainer,
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
      name: 'container',
      component: Container,
      meta: { requiresAuth: true },
      children: [
        {
          path: 'teams',
          name: 'teamList',
          component: TeamList,
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
          name: 'teamPageContainer',
          component: teamPageContainer,
          children: [
            {
              path: 'product_backlog',
              name: 'productBacklog',
              component: ProductBacklog,
              children: [
                {
                  path: 'create',
                  name: 'productBacklogItemCreate',
                  component: ProductBacklogItemCreate
                },
                {
                  path: ':itemId',
                  name: 'productBacklogItemDetail',
                  component: ProductBacklogItemDetail
                }
              ]
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
            },
            {
              path: 'members',
              name: 'members',
              component: Members
            }
          ]
        }
      ]
    }
  ]
})

// 遷移前に必ず呼ばれるコールバックを登録
router.beforeEach((to, from, next) => {
  // 遷移前に毎回、onAuthStateChangedをコールしてcurrentUserをチェック
  if (to.matched.some(record => record.meta.requiresAuth)) {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // ストアにauthUserをセット
        store.dispatch('setAuthUser', user)
        // そのまま遷移
        next()
      } else {
        // ストアのauthUserをremove
        store.dispatch('removeAuthUser')
        // ログイン画面にリダイレクト
        next({
          name: 'signIn',
          query: { redirect: to.fullPath }
        })
      }
    })
  } else {
    next()
  }
})

export default router
