import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAxkQA5tBqp_5fco6Y_8i2mhI15ECJeNh0",
  authDomain: "cookiemovie-27669.firebaseapp.com",
  projectId: "cookiemovie-27669",
  storageBucket: "cookiemovie-27669.appspot.com", // Corrected firebasestorage.app to appspot.com for storageBucket
  messagingSenderId: "845488313573",
  appId: "1:845488313573:web:e4928462b97eb4dda4300c"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
