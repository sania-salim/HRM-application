// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";


// Add Firebase products that you want to use
import {
    getDatabase,
    child,
    ref,
    get,
    onValue,
    set,
    update,
    query,
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";


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
const db = getDatabase(app);

export {
    app,
    db,
    getDatabase,
    ref,
    child,
    get,
    onValue,
    set,
    update,
    query,
}

// //testing adding data to db
// function writeUserData() {

//     console.log("hi")
//     set(ref(db, 'users/' + "First"), {
//         username: "sania",
//         email: "sania@gmail"
//     });
// }

// writeUserData();

// //testing reading

// const usr = ref(db, 'users/' + "First");
// onValue(usr, (snapshot) => {
//     console.log("hi", snapshot.val());
// });


// const emp = ref(db, 'employees/' + "0");
// onValue(emp, (snapshot) => {
//     console.log("hi2", snapshot.val());
// });