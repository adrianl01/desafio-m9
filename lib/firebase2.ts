import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Initialize Firebase

const firebaseConfig = { apiKey: "AIzaSyDW4djeiPaiBqzg0pjgpQd2e3Z76TXMPxg", authDomain: "passwordless-85655.firebaseapp.com", projectId: "passwordless-85655", storageBucket: "passwordless-85655.firebasestorage.app", messagingSenderId: "108119391837", appId: "1:108119391837:web:c5d4913e7e4a2dc946d7b4", measurementId: "G-T6D3THBRCD" }


const app = initializeApp(firebaseConfig);
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);
export { db }
