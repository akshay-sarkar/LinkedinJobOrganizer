import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';

// Firebase configuration - these should be set in environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Check if Firebase config is available
const isConfigured = firebaseConfig.apiKey && firebaseConfig.authDomain;

// Lazy initialization - only initialize when needed and on client side
let app = null;
let auth = null;
let googleProvider = null;

const getFirebaseApp = () => {
  if (!isConfigured) {
    console.warn('Firebase is not configured. Please set up environment variables.');
    return null;
  }

  if (typeof window === 'undefined') {
    // Don't initialize on server
    return null;
  }

  if (!app) {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  }
  return app;
};

const getFirebaseAuth = () => {
  const firebaseApp = getFirebaseApp();
  if (!firebaseApp) return null;

  if (!auth) {
    auth = getAuth(firebaseApp);
  }
  return auth;
};

const getGoogleProvider = () => {
  if (!googleProvider) {
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({
      prompt: 'select_account',
    });
  }
  return googleProvider;
};

// Sign in with Google
export const signInWithGoogle = async () => {
  const firebaseAuth = getFirebaseAuth();
  const provider = getGoogleProvider();

  if (!firebaseAuth || !provider) {
    return {
      success: false,
      error: 'Firebase is not configured. Please set up environment variables.',
    };
  }

  try {
    const result = await signInWithPopup(firebaseAuth, provider);
    return {
      success: true,
      user: result.user,
    };
  } catch (error) {
    console.error('Error signing in with Google:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Sign out
export const signOut = async () => {
  const firebaseAuth = getFirebaseAuth();

  if (!firebaseAuth) {
    return {
      success: false,
      error: 'Firebase is not configured.',
    };
  }

  try {
    await firebaseSignOut(firebaseAuth);
    return { success: true };
  } catch (error) {
    console.error('Error signing out:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Subscribe to auth state changes
export const subscribeToAuthState = (callback) => {
  const firebaseAuth = getFirebaseAuth();

  if (!firebaseAuth) {
    // Call with null user immediately if Firebase is not configured
    callback(null);
    return () => {}; // Return empty unsubscribe function
  }

  return onAuthStateChanged(firebaseAuth, callback);
};

// Export for direct access if needed
export { getFirebaseAuth as auth, getFirebaseApp as app };
