// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "posterscript",
  "appId": "1:792606330261:web:5e14b903d4a49866cd3a9c",
  "storageBucket": "posterscript.firebasestorage.app",
  "apiKey": "AIzaSyB8ug33Ggm6DEO7e1ThGIRPJCKypHOodN4",
  "authDomain": "posterscript.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "792606330261"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
