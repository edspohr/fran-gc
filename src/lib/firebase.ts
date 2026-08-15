import { initializeApp, type FirebaseApp } from 'firebase/app';
import {
  browserLocalPersistence,
  connectAuthEmulator,
  getAuth,
  setPersistence,
  type Auth,
} from 'firebase/auth';
import {
  connectFirestoreEmulator,
  getFirestore,
  type Firestore,
} from 'firebase/firestore';
import {
  connectStorageEmulator,
  getStorage,
  type FirebaseStorage,
} from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const missingKeys = Object.entries(firebaseConfig)
  .filter(([, v]) => !v)
  .map(([k]) => k);

if (missingKeys.length > 0 && import.meta.env.PROD) {
  // eslint-disable-next-line no-console
  console.error(
    `[firebase] Missing env vars for production build: ${missingKeys.join(', ')}. ` +
      'Copy .env.example to .env.production and fill in values from the Firebase Console.',
  );
}

export const app: FirebaseApp = initializeApp(firebaseConfig);
export const db: Firestore = getFirestore(app);
export const auth: Auth = getAuth(app);
export const storage: FirebaseStorage = getStorage(app);

setPersistence(auth, browserLocalPersistence).catch((err: unknown) => {
  // eslint-disable-next-line no-console
  console.warn('[firebase] Could not set browserLocalPersistence:', err);
});

if (import.meta.env.DEV && import.meta.env.VITE_USE_EMULATORS === '1') {
  const host = '127.0.0.1';
  connectFirestoreEmulator(db, host, 8080);
  connectAuthEmulator(auth, `http://${host}:9099`, { disableWarnings: true });
  connectStorageEmulator(storage, host, 9199);
  // eslint-disable-next-line no-console
  console.info('[firebase] Connected to local emulators (Firestore:8080, Auth:9099, Storage:9199)');
}
