import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

let config

// 環境によって向き先のFirebaseプロジェクトを変更
switch (process.env.NODE_ENV) {
  case 'development':
    config = {
      apiKey: 'AIzaSyA21Y-7Y3GDHero6lzbi_HGAV43z6sY6m4',
      authDomain: 'scrumboard-development.firebaseapp.com',
      databaseURL: 'https://scrumboard-development.firebaseio.com',
      projectId: 'scrumboard-development',
      storageBucket: 'scrumboard-development.appspot.com',
      messagingSenderId: '275575502339'
    }
    break
  case 'testing':
    config = {
      apiKey: 'AIzaSyA21Y-7Y3GDHero6lzbi_HGAV43z6sY6m4',
      authDomain: 'scrumboard-development.firebaseapp.com',
      databaseURL: 'https://scrumboard-development.firebaseio.com',
      projectId: 'scrumboard-development',
      storageBucket: 'scrumboard-development.appspot.com',
      messagingSenderId: '275575502339'
    }
    break
  case 'production':
    config = {
      apiKey: 'AIzaSyDMqkd2u6U4R6fq_XN-ThKPzk4o-tydZ0Y',
      authDomain: 'scrumboard-production.firebaseapp.com',
      databaseURL: 'https://scrumboard-production.firebaseio.com',
      projectId: 'scrumboard-production',
      storageBucket: 'scrumboard-production.appspot.com',
      messagingSenderId: '56228311883'
    }
    break
  default:
    break
}

firebase.initializeApp(config)

export default firebase
