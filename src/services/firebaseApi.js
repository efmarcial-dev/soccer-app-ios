// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAHH7luvKvP1eGuLEJnOsbAZRksXFhmtCU",
  authDomain: "soccer-app-1058e.firebaseapp.com",
  projectId: "soccer-app-1058e",
  storageBucket: "soccer-app-1058e.firebasestorage.app",
  messagingSenderId: "235252390005",
  appId: "1:235252390005:web:df066bdb9a3364d9c9c03c",
  measurementId: "G-R07V9Y1CTS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);