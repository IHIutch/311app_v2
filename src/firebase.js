import firebase from "firebase";

export const db = firebase
  .initializeApp({ projectId: "buffalo-311" })
  .firestore();

const { TimeStamp, GeoPoint } = firebase.firestore;
export { TimeStamp, GeoPoint };
