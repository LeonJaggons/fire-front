// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDFEoB5H8HyyW2M62l0BzuSxFM8mvrqSzo",
    authDomain: "firefront-c3abb.firebaseapp.com",
    projectId: "firefront-c3abb",
    storageBucket: "firefront-c3abb.appspot.com",
    messagingSenderId: "862065968550",
    appId: "1:862065968550:web:24dd70e15e5fc094e57b67",
};

const app = initializeApp(firebaseConfig);

export const fireStore = getFirestore(app);
export const fireStorage = getStorage(app);
export const fireAuth = getAuth(app);
