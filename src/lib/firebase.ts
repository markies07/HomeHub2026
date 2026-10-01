// Firebase Client Configuration
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDRbAXb2NOYPhVU8Z_pr37VX80o75VpGKU",
  authDomain: "homehub-56386.firebaseapp.com",
  projectId: "homehub-56386",
  storageBucket: "homehub-56386.firebasestorage.app",
  messagingSenderId: "89842113755",
  appId: "1:89842113755:web:7ac494e02d78ac209c80fe",
  measurementId: "G-F0C8EM3FC1"
};

// Initialize Firebase App (prevent reinitialization during Next.js hot reload)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
