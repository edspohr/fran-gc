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

export const isFirebaseConfigured = Boolean(import.meta.env.VITE_FIREBASE_API_KEY);

// Demo values keep the SDK from throwing during module init when env vars
// are absent (local dev without a real project). All actual API calls are
// gated on `isFirebaseConfigured` at the call sites, so no traffic escapes.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? 'demo-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? 'demo.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? 'demo',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? 'demo.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '000000000000',
  appId: import.meta.env.VITE_FIREBASE_APP_ID ?? '1:000000000000:web:0000000000000000000000',
};

if (!isFirebaseConfigured && import.meta.env.PROD) {
  // eslint-disable-next-line no-console
  console.error(
    '[firebase] Missing VITE_FIREBASE_* env vars in production build. ' +
      'Copy .env.example to .env.production and fill in values from the Firebase Console.',
  );
}

export const app: FirebaseApp = initializeApp(firebaseConfig);
export const db: Firestore = getFirestore(app);
export const auth: Auth = getAuth(app);
export const storage: FirebaseStorage = getStorage(app);

if (isFirebaseConfigured) {
  setPersistence(auth, browserLocalPersistence).catch((err: unknown) => {
    // eslint-disable-next-line no-console
    console.warn('[firebase] Could not set browserLocalPersistence:', err);
  });
}

if (isFirebaseConfigured && import.meta.env.DEV && import.meta.env.VITE_USE_EMULATORS === '1') {
  const host = '127.0.0.1';
  connectFirestoreEmulator(db, host, 8080);
  connectAuthEmulator(auth, `http://${host}:9099`, { disableWarnings: true });
  connectStorageEmulator(storage, host, 9199);
  // eslint-disable-next-line no-console
  console.info('[firebase] Connected to local emulators (Firestore:8080, Auth:9099, Storage:9199)');
}
