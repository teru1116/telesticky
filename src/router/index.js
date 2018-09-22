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
import Account from '@/components/AccountSettings'

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
      meta: {
        requiresAuth: true
      },
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
        },
        {
          path: 'account',
          name: 'account',
          component: Account
        }
      ]
    }
  ]
})

// ナビゲーションガード設定
router.beforeEach((to, from, next) => {
  // 認証が必要なURLへのアクセスの場合
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // 遷移前に毎回、onAuthStateChangedをコールしてcurrentUserをチェック
    firebase.auth().onAuthStateChanged(user => {
      // サインイン状態の場合
      if (user) {
        // ストアにauthUserをセットする
        store.dispatch('setAuthUser', user)

        let teamId = ''
        let activeSprintId = ''
        // 以下、リダイレクトが必要なパス
        switch (to.name) {
          case 'container':
            // 前回使っていたteamが残っていれば、そのteamのスプリントあるいはプロダクトバックログ画面にリダイレクト
            teamId = localStorage.getItem('tid')
            activeSprintId = localStorage.getItem('sid')
            if (teamId) {
              if (activeSprintId) {
                next({ name: 'sprintBacklog', params: { teamId: teamId } })
              } else {
                next({ name: 'productBacklog', params: { teamId: teamId } })
              }
            } else {
              next('/teams')
            }
            break
          case 'teamPageContainer':
            teamId = localStorage.getItem('tid')
            activeSprintId = localStorage.getItem('sid')
            if (teamId) {
              if (activeSprintId) {
                next({ name: 'sprintBacklog', params: { teamId: teamId } })
              } else {
                next({ name: 'productBacklog', params: { teamId: teamId } })
              }
            } else {
              next('/teams')
            }
            break
          default:
            next()
            break
        }
      } else {
        // サインアウト状態の場合は、ストアのauthUserをremove
        store.dispatch('signOut')
        // ログイン画面にリダイレクト
        next({ name: 'signIn', query: { redirect: to.fullPath } })
      }
    })
  } else {
    next()
  }
})

export default router
