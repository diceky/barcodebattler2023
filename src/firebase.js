import firebase from "firebase/app";
import "firebase/firestore";

// Initialize Firebase
const config = {
  apiKey: "AIzaSyDefiFwdWvR5crfJPFrAAJaHTfHTRqTDVM",
  authDomain: "barcode-battler-436a6.firebaseapp.com",
  databaseURL: "https://barcode-battler-436a6.firebaseio.com",
  projectId: "barcode-battler-436a6",
  storageBucket: "barcode-battler-436a6.appspot.com",
  messagingSenderId: "882649825758"
};

const firebaseApp = firebase.initializeApp(config);
const settings = {/* your settings... */ timestampsInSnapshots: true};
firebaseApp.firestore().settings(settings);
export const firestore = firebaseApp.firestore();