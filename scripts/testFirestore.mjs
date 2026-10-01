import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDRbAXb2NOYPhVU8Z_pr37VX80o75VpGKU",
  authDomain: "homehub-56386.firebaseapp.com",
  projectId: "homehub-56386",
  storageBucket: "homehub-56386.firebasestorage.app",
  messagingSenderId: "89842113755",
  appId: "1:89842113755:web:7ac494e02d78ac209c80fe",
  measurementId: "G-F0C8EM3FC1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function testConnection() {
  console.log("Connecting to Firestore for project:", firebaseConfig.projectId);
  try {
    const testDocRef = doc(db, "test_connection", "ping");
    await setDoc(testDocRef, {
      message: "Firestore connection successful!",
      timestamp: new Date().toISOString()
    });
    console.log("Successfully wrote test document to Firestore!");
  } catch (err) {
    console.error("Firestore test error:", err);
  }
  process.exit(0);
}

testConnection();
