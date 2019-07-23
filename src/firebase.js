import firebase from "firebase";

export const db = firebase
  .initializeApp({ databaseURL: "https://buffalo-311.firebaseio.com" })
  .database();
