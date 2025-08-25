
'use client';

import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

const firebaseConfig = {
  projectId: 'posterscript',
  appId: '1:792606330261:web:5e14b903d4a49866cd3a9c',
  storageBucket: 'posterscript.appspot.com',
  apiKey: 'AIzaSyB8ug33Ggm6DEO7e1ThGIRPJCKypHOodN4',
  authDomain: 'posterscript.firebaseapp.com',
  measurementId: '',
  messagingSenderId: '792606330261',
};


let app: ReturnType<typeof initializeApp>;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const db = getFirestore(app);

export { app, db };
