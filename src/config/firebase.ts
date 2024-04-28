import { initializeApp } from 'firebase/app';
import { GoogleAuthProvider, getAuth } from 'firebase/auth';
import { collection, getFirestore } from 'firebase/firestore';
import { getStorage, ref } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleAuthProvider = new GoogleAuthProvider();
const db = getFirestore(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);

// References
const usersCollectionRef = collection(db, 'users');
const palettesCollectionRef = collection(db, 'palettes');

const getLikesCollectionRef = (paletteId: string) =>
  collection(palettesCollectionRef, paletteId, 'likes');

const getAvatarStorageRef = (uid: string) =>
  ref(storage, `users/${uid}/avatar`);

export {
  auth,
  googleAuthProvider,
  db,
  storage,
  usersCollectionRef,
  palettesCollectionRef,
  getLikesCollectionRef,
  getAvatarStorageRef,
  analytics,
};
