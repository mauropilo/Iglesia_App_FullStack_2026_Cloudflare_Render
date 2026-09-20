import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { env } from "./env.js";

function obtenerAplicacion() {
  if (getApps().length) return getApps()[0];
  if (env.demoMode) return null;
  return initializeApp({ credential: cert({
    projectId: env.firebaseProjectId,
    clientEmail: env.firebaseClientEmail,
    privateKey: env.firebasePrivateKey,
  }) });
}

export async function verificarTokenGoogle(token) {
  if (env.demoMode && token === "demo-token") {
    return { uid: "demo-admin", email: env.adminEmails[0] ?? `admin@${env.allowedEmailDomain}`, name: "Administrador Demo" };
  }
  const aplicacion = obtenerAplicacion();
  return getAuth(aplicacion).verifyIdToken(token, true);
}
