import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyBMOGpYzm_krm66Xtkh9CXriP2jJlMVfTs",
  authDomain: "math-education-c09a8.firebaseapp.com",
  projectId: "math-education-c09a8",
  storageBucket: "math-education-c09a8.firebasestorage.app",
  messagingSenderId: "522545520014",
  appId: "1:522545520014:web:a1c8da693e67c6acfb58df",
  measurementId: "G-LSPV4M26WE",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firestore
export const db = getFirestore(app)
