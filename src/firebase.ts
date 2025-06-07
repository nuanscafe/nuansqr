// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDwlqDKuq9fpSqfvzON6tBEgMx63IQLMw0",
  authDomain: "cafeqr-d658f.firebaseapp.com",
  projectId: "cafeqr-d658f",
  storageBucket: "cafeqr-d658f.firebasestorage.app",
  messagingSenderId: "266670888353",
  appId: "1:266670888353:web:bb50567816c2681197e7e0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export { app, db };