// Replace values below with your Firebase config
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDHpahNEKXvdwYeUa1LuW3rnkJ07lLlsLo",
  authDomain: "parking-2b407.firebaseapp.com",
  projectId: "parking-2b407",
  storageBucket: "parking-2b407.firebasestorage.app",
  messagingSenderId: "886068076143",
  appId: "1:886068076143:web:592257dc79d685f800379a",
  measurementId: "G-PVBXB2D396"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup };
