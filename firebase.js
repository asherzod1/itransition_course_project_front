// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage, ref } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBAxgWksKw01MYa4JjSTa1pFB34wBuPUMM",
    authDomain: "vivid-zodiac-374113.firebaseapp.com",
    projectId: "vivid-zodiac-374113",
    storageBucket: "vivid-zodiac-374113.appspot.com",
    messagingSenderId: "780263920596",
    appId: "1:780263920596:web:de38f32031391a2cd03c41",
    measurementId: "G-QDQK4JBJ7P"
};

export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const storageRef = ref(storage);
