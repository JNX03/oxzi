import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBgjutbuHPp5qGGYlQcWN1uEplTEF77b6s",
  authDomain: "prc-oxzi.firebaseapp.com",
  projectId: "prc-oxzi",
  storageBucket: "prc-oxzi.firebasestorage.app",
  messagingSenderId: "208927937083",
  appId: "1:208927937083:web:aea2e2ef596c10aa85821e",
  measurementId: "G-PD40KZLG5F"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };

