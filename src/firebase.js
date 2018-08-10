import firebase from 'firebase/app'
import 'firebase/firestore'

// Initialize Firebase
const config = {
  apiKey: "AIzaSyBInAaDcev5irvlzvWN-3ggmIQQcs3iQpg",
  authDomain: "web-scrum-board.firebaseapp.com",
  databaseURL: "https://web-scrum-board.firebaseio.com",
  projectId: "web-scrum-board",
  storageBucket: "web-scrum-board.appspot.com",
  messagingSenderId: "554435278181"
}
firebase.initializeApp(config)

export default firebase
