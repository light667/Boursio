import { initializeApp, type FirebaseApp, getApps } from "firebase/app";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBYp-up7ekvFqCmlySn9PCpAOiwTepdUuc",
  authDomain: "boursio.firebaseapp.com",
  projectId: "boursio",
  storageBucket: "boursio.firebasestorage.app",
  messagingSenderId: "435468288038",
  appId: "1:435468288038:web:154926d4cace31bd5266e7",
  measurementId: "G-F08E4C1S9F",
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
