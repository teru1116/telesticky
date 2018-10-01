import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

firebase.initializeApp({
  apiKey: 'AIzaSyBInAaDcev5irvlzvWN-3ggmIQQcs3iQpg',
  authDomain: 'web-scrum-board.firebaseapp.com',
  databaseURL: 'https://web-scrum-board.firebaseio.com',
  projectId: 'web-scrum-board',
  storageBucket: 'web-scrum-board.appspot.com',
  messagingSenderId: '554435278181'
})

export default firebase
