/**
 * LonAsh Tours - Firebase Backend Integration
 * 
 * This script initializes Firebase and exports the database and auth instances.
 * To use your own project:
 * 1. Create a project at https://console.firebase.google.com/
 * 2. Enable Firestore and Authentication (Email/Password)
 * 3. Replace the config below with your project's settings
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc, limit } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
    // Replace these with your actual Firebase project configuration
    apiKey: "YOUR_API_KEY",
    authDomain: "lonash-tours.firebaseapp.com",
    projectId: "lonash-tours",
    storageBucket: "lonash-tours.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Export instances and helper functions
export { 
    db, 
    auth, 
    collection, 
    addDoc, 
    getDocs, 
    query, 
    orderBy, 
    onSnapshot, 
    doc, 
    updateDoc, 
    deleteDoc,
    limit,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
};
