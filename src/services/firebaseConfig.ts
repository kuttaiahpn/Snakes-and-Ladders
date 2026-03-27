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
  console.warn('[FIREBASE_WARNING] Project ID is missing! Firebase features will be disabled. Check your CI/CD Build Args.');
}

let app;
let db = null;
let analytics = null;

try {
  if (firebaseConfig.projectId) {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    
    // Initialize Analytics safely
    if (typeof window !== 'undefined' && firebaseConfig.measurementId) {
      analytics = getAnalytics(app);
      console.log('[FIREBASE] Analytics initialized for Hackathon tracking.');
    }
  }
} catch (error) {
  console.error('[FIREBASE_ERROR] Failed to initialize Firebase:', error);
}

export { db, analytics };

// Helper to log hackathon events
export const trackGameEvent = (name: string, params?: object) => {
  try {
    if (analytics) {
      logEvent(analytics, name, params);
    }
  } catch (e) {
    console.warn('[FIREBASE] Event tracking failed:', e);
  }
};
