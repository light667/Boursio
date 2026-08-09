import { initializeApp, type FirebaseApp, getApps } from "firebase/app";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCtIqEpaOSKvFYAgSqTpzCIW4eAk28RFXg",
  authDomain: "flyai-org.firebaseapp.com",
  projectId: "flyai-org",
  storageBucket: "flyai-org.firebasestorage.app",
  messagingSenderId: "83333785148",
  appId: "1:83333785148:web:e8bab952b1cf9e15d20539",
  measurementId: "G-Z087BYDKX9",
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

