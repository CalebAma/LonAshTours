import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc, limit } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "lonash-tours.firebaseapp.com",
    projectId: "lonash-tours",
    storageBucket: "lonash-tours.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

const IS_CONFIGURED = !firebaseConfig.apiKey.includes('YOUR_') &&
    !firebaseConfig.messagingSenderId.includes('YOUR_') &&
    !firebaseConfig.appId.includes('YOUR_');

let db, auth;

if (IS_CONFIGURED) {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
} else {
    db = { _mock: true };
    auth = { _mock: true };
}

const _collection = IS_CONFIGURED ? collection : () => null;
const _addDoc = IS_CONFIGURED ? addDoc : async () => ({ id: 'mock-' + Date.now() });
const _getDocs = IS_CONFIGURED ? getDocs : async () => ({ docs: [] });
const _query = IS_CONFIGURED ? query : (...args) => args[0];
const _orderBy = IS_CONFIGURED ? orderBy : () => null;
const _onSnapshot = IS_CONFIGURED ? onSnapshot : (q, cb, errCb) => { if (cb) cb({ docs: [] }); return () => {}; };
const _doc = IS_CONFIGURED ? doc : () => ({});
const _updateDoc = IS_CONFIGURED ? updateDoc : async () => {};
const _deleteDoc = IS_CONFIGURED ? deleteDoc : async () => {};
const _limit = IS_CONFIGURED ? limit : () => null;
const _signInWithEmailAndPassword = IS_CONFIGURED ? signInWithEmailAndPassword : async () => { throw new Error('Firebase not configured. Please update firebase-config.js with your project credentials.'); };
const _onAuthStateChanged = IS_CONFIGURED ? onAuthStateChanged : (a, cb) => { cb(null); return () => {}; };
const _signOut = IS_CONFIGURED ? signOut : async () => {};

export {
    db,
    auth,
    _collection as collection,
    _addDoc as addDoc,
    _getDocs as getDocs,
    _query as query,
    _orderBy as orderBy,
    _onSnapshot as onSnapshot,
    _doc as doc,
    _updateDoc as updateDoc,
    _deleteDoc as deleteDoc,
    _limit as limit,
    _signInWithEmailAndPassword as signInWithEmailAndPassword,
    _onAuthStateChanged as onAuthStateChanged,
    _signOut as signOut
};
