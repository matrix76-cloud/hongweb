import firebase from "firebase/compat/app";

// Add the Firebase products that you want to use
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";


export const firebaseConfig = {
    apiKey: "AIzaSyBe1PFtU89t61ULsIPIfowduJyy6PgpFB4",
    authDomain: "help-bbcb5.firebaseapp.com",
    projectId: "help-bbcb5",
    storageBucket: "help-bbcb5.appspot.com",
    messagingSenderId: "78320292657",
    appId: "1:78320292657:web:53aedeeae92644a2da9610",
    measurementId: "G-9NCCYEL925"
};
const firebaseApp = firebase.initializeApp(firebaseConfig);
firebaseApp.firestore().settings({ experimentalForceLongPolling: true });
const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage, firebaseApp };