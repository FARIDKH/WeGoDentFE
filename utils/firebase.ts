// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAKPE44SnxiE4omwDXIsIRjdunQzFaCmf0",
  authDomain: "wegodent-2022.firebaseapp.com",
  projectId: "wegodent-2022",
  storageBucket: "wegodent-2022.appspot.com",
  messagingSenderId: "421904119472",
  appId: "1:421904119472:web:3ce358dccb1ddeffd52d75",
  measurementId: "G-C5QMN65MZ7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage }