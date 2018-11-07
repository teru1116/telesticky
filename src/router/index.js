import Vue from 'vue'
import Router from 'vue-router'
import firebase from '@/firebase'
import store from '@/store'

import Container from '@/pages/SignedInPageContainer'
import SignUp from '@/pages/SignUp'
import SignIn from '@/pages/SignIn'
import Invited from '@/pages/Invited'
import TeamList from '@/pages/TeamList'
import TeamCreate from '@/pages/TeamCreate'
import TeamPageContainer from '@/pages/TeamPageContainer'
import ProductBacklog from '@/pages/ProductBacklog'
import ProductBacklogItemCreate from '@/pages/ProductBacklogItemCreate'
import ProductBacklogItemDetail from '@/pages/ProductBacklogItemDetail'
import SprintBacklog from '@/pages/SprintBacklog'
import Settings from '@/pages/TeamSettings'
import Members from '@/pages/TeamMembers'
import MemberInvite from '@/pages/TeamMemberInvite'
import Account from '@/pages/AccountSettings'
import Visitor from '@/pages/Visitor'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    // Landing Page
    {
      path: '/visitor',
      name: 'visitor',
      component: Visitor
    },
    // auth
    {
      path: '/sign_up',
      name: 'signUp',
      component: SignUp
    },
    {
      path: '/sign_in',
      name: 'signIn',
      component: SignIn
    },
    {
      path: '/invited',
      name: 'invited',
      component: Invited
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
        // チーム一覧
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
        // チーム個別
        {
          path: 'teams/:teamId',
          name: 'teamPageContainer',
          component: TeamPageContainer,
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
              component: Members,
              children: [
                {
                  path: 'invite',
                  name: 'memberInvite',
                  component: MemberInvite
                }
              ]
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
