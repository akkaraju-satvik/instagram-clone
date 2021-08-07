import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyBnH4_39VA71zSh2Oq4YeVmtZccZbthHUs",
    authDomain: "instagram-clone-by-satvik.firebaseapp.com",
    projectId: "instagram-clone-by-satvik",
    storageBucket: "instagram-clone-by-satvik.appspot.com",
    messagingSenderId: "739704710503",
    appId: "1:739704710503:web:38396edef18d9a1c237bc2",
    measurementId: "G-DLQ76BMC32"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };