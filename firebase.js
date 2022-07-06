// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDSL71qYGp8y_-rjNF0NlEc7UeC9yIHYSE",
  authDomain: "tinder2-d8c32.firebaseapp.com",
  projectId: "tinder2-d8c32",
  storageBucket: "tinder2-d8c32.appspot.com",
  messagingSenderId: "188774329788",
  appId: "1:188774329788:web:549a809f967455385c4fb9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

export { auth, db };
