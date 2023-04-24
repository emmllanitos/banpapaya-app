// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC52LYmTm_g4sMN5lvBk5tCNbSFSyWiZ0c",
  authDomain: "banpapaya-app.firebaseapp.com",
  projectId: "banpapaya-app",
  storageBucket: "banpapaya-app.appspot.com",
  messagingSenderId: "855300073015",
  appId: "1:855300073015:web:ed253c28dcfd6e6bb901b2",
  measurementId: "G-HSFZS7P6LC"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export  const analytics = getAnalytics(app);
export const auth = getAuth(app);
