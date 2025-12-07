import type { Auth } from "firebase/auth";
import type { FirebaseApp } from "firebase/app";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDBj1KeuZNvvOMOGdyCL9WmNkcdX5my85Y",
  authDomain: "revwheel-c799d.firebaseapp.com",
  projectId: "revwheel-c799d",
  storageBucket: "revwheel-c799d.firebasestorage.app",
  messagingSenderId: "213793529600",
  appId: "1:213793529600:web:982dc6d624320254f85de5",
  measurementId: "G-9KSC6TV48M"
};

// Lazy-loaded Firebase instances
let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let googleProvider: any = null;

// Lazy initialize Firebase - only when needed
export const getFirebaseApp = async (): Promise<FirebaseApp> => {
  if (!app) {
    const { initializeApp } = await import("firebase/app");
    app = initializeApp(firebaseConfig);
  }
  return app;
};

// Lazy initialize Auth - only when needed
export const getFirebaseAuth = async (): Promise<Auth> => {
  if (!auth) {
    const firebaseApp = await getFirebaseApp();
    const { getAuth } = await import("firebase/auth");
    auth = getAuth(firebaseApp);
  }
  return auth;
};

// Lazy initialize Google Provider - only when needed
export const getGoogleProvider = async () => {
  if (!googleProvider) {
    const { GoogleAuthProvider } = await import("firebase/auth");
    googleProvider = new GoogleAuthProvider();
  }
  return googleProvider;
};

// For backwards compatibility - these will lazy load on first access
export { app, auth, googleProvider };

export default { getFirebaseApp, getFirebaseAuth, getGoogleProvider };
