import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const demo = import.meta.env.VITE_DEMO_MODE === "true";
const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || (demo ? "demo-api-key" : undefined),
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || (demo ? "demo.local" : undefined),
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || (demo ? "iglesia-demo" : undefined),
  appId: import.meta.env.VITE_FIREBASE_APP_ID || (demo ? "1:000000000000:web:demo" : undefined),
};

const app = initializeApp(config);
export const auth = getAuth(app);
export const proveedorGoogle = new GoogleAuthProvider();
proveedorGoogle.setCustomParameters({ prompt: "select_account" });
