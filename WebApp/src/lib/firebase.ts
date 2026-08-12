import { initializeApp, type FirebaseApp, getApps } from "firebase/app";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "boursio.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "boursio",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "boursio.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "435468288038",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "",
};

let analytics: Analytics | null = null;
let app: FirebaseApp | null = null;

export function getFirebaseApp() {
  if (app) return app;
  app = getApps()[0] ?? initializeApp(firebaseConfig);
  return app;
}

export async function initFirebaseAnalytics() {
  if (typeof window === "undefined") return null;
  if (analytics) return analytics;

  const supported = await isSupported().catch(() => false);
  if (!supported) return null;

  analytics = getAnalytics(getFirebaseApp());
  return analytics;
}
