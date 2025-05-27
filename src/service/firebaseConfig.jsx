// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBMlbYjch-Ap9FykpOf_YBvwP7_Ld8Ft0Q",
  authDomain: "ai-travel-planner-3acb8.firebaseapp.com",
  projectId: "ai-travel-planner-3acb8",
  storageBucket: "ai-travel-planner-3acb8.firebasestorage.app",
  messagingSenderId: "497169501316",
  appId: "1:497169501316:web:ddce2e811a461a63c046d1",
  measurementId: "G-9GLR4XZZ0B"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)

// const analytics = getAnalytics(app);