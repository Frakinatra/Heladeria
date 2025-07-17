import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCNT88WH3qQM-oLRwbs_yK5pmWhpQ0zBN4",
  authDomain: "ejemplo-79237.firebaseapp.com",
  projectId: "ejemplo-79237",
  storageBucket: "ejemplo-79237.firebasestorage.app",
  messagingSenderId: "230570890167",
  appId: "1:230570890167:web:8117cb297e3e542e5b4e32",
  measurementId: "G-C632712CVD"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export {db,auth};