import firebase from "firebase/app";
import "firebase/auth";

var firebaseConfig = {
  apiKey: "AIzaSyCTmsO8N8V17TKNIrvN6sjWe4bNsFvL3_4",
  authDomain: "curso-redux-blis.firebaseapp.com",
  databaseURL: "https://curso-redux-blis.firebaseio.com",
  projectId: "curso-redux-blis",
  storageBucket: "curso-redux-blis.appspot.com",
  messagingSenderId: "986590764053",
  appId: "1:986590764053:web:3463193da76466e6d6c21c"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export function signOutGoogle() {
  firebase.auth().signOut();
}

export function loginWithGoogle() {
  let provider = new firebase.auth.GoogleAuthProvider();
  return firebase
    .auth()
    .signInWithPopup(provider)
    .then(snap => snap.user);
}
