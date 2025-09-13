// Firebase initialization with optional Firestore Emulator support
// - Uses EXPO_PUBLIC_ env vars when provided
// - Falls back to Firestore Emulator automatically if no credentials are set

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

// Detect whether credentials are provided via Expo public env vars
const isConfigProvided = !!process.env.EXPO_PUBLIC_FIREBASE_API_KEY;
// Allow explicit opt-in/out via EXPO_PUBLIC_USE_FIRESTORE_EMULATOR
const emulatorFlag = process.env.EXPO_PUBLIC_USE_FIRESTORE_EMULATOR;
const USE_EMULATOR = emulatorFlag === 'true' || (!isConfigProvided && emulatorFlag !== 'false');

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || 'YOUR_API_KEY',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || 'YOUR_AUTH_DOMAIN',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || (USE_EMULATOR ? 'demo-minifood' : 'YOUR_PROJECT_ID'),
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || 'YOUR_STORAGE_BUCKET',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || 'YOUR_MESSAGING_SENDER_ID',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || 'YOUR_APP_ID',
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);

if (USE_EMULATOR) {
  // Defaults to localhost:8080; override with EXPO_PUBLIC_FIRESTORE_EMULATOR_HOST/PORT
  const host = process.env.EXPO_PUBLIC_FIRESTORE_EMULATOR_HOST || 'localhost';
  const port = Number(process.env.EXPO_PUBLIC_FIRESTORE_EMULATOR_PORT || 8080);
  connectFirestoreEmulator(db, host, port);
}