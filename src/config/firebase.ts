import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

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

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

export default app;

