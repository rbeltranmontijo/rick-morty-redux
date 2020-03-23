import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

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

let db = firebase.firestore().collection("favs");

export function getFavorities(uid) {
  return db
    .doc(uid)
    .get()
    .then(snap => {
      return snap.data().array;
    });
}

export function updateDB(array, uid) {
  db.doc(uid).set({ array });
}

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
