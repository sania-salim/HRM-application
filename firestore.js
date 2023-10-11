// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getFirestore, getDoc, getDocs, collection, addDoc, query, where, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAJTxERLBx3Ff6IoTjqXk1TvjQmDe6AxSs",
    authDomain: "hrm-application-6aa96.firebaseapp.com",
    databaseURL:
        "https://hrm-application-6aa96-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "hrm-application-6aa96",
    storageBucket: "hrm-application-6aa96.appspot.com",
    messagingSenderId: "979079887399",
    appId: "1:979079887399:web:486ac4e7e37b5acefaac02",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Instance of database
const db = getFirestore(app);

export { db, getDocs, getDoc, collection, addDoc, query, where, doc, setDoc };


