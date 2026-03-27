import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, LogEventName, logEvent } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || '',
};

// Runtime Validation for Build-time Injection
if (!firebaseConfig.projectId || firebaseConfig.projectId === '') {
  console.error('[FIREBASE_CRITICAL] Project ID is missing! Ensure VITE_FIREBASE_PROJECT_ID is passed as a BUILD ARG in Docker/Cloud Build.');
}

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Initialize Analytics safely
let analytics = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
  console.log('[FIREBASE] Analytics initialized for Hackathon tracking.');
}

export { analytics };

// Helper to log hackathon events
export const trackGameEvent = (name: string, params?: object) => {
  if (analytics) {
    logEvent(analytics, name, params);
  }
};
