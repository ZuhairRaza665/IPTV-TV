// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDt6Ho1P78lOQq9ufbWJw-9p8RHgAb8aN0",
  authDomain: "iptv-7f384.firebaseapp.com",
  projectId: "iptv-7f384",
  storageBucket: "iptv-7f384.appspot.com",
  messagingSenderId: "988838499883",
  appId: "1:988838499883:web:80645db228ab823979bc6e",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // Initialize Firestore

export { app, auth, db };
