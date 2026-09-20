import "dotenv/config";

const lista = (valor = "") => valor.split(",").map((item) => item.trim().toLowerCase()).filter(Boolean);
const booleano = (valor, predeterminado = false) => valor == null ? predeterminado : valor === "true";

export const env = Object.freeze({
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 4000),
  frontendUrls: lista(process.env.FRONTEND_URLS ?? process.env.FRONTEND_URL ?? "http://localhost:5173"),
  googleSheetId: process.env.GOOGLE_SHEET_ID ?? "",
  googleServiceAccountEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ?? "",
  googlePrivateKey: (process.env.GOOGLE_PRIVATE_KEY ?? "").replace(/\\n/g, "\n"),
  firebaseProjectId: process.env.FIREBASE_PROJECT_ID ?? "",
  firebaseClientEmail: process.env.FIREBASE_CLIENT_EMAIL ?? "",
  firebasePrivateKey: (process.env.FIREBASE_PRIVATE_KEY ?? "").replace(/\\n/g, "\n"),
  allowedEmailDomain: (process.env.ALLOWED_EMAIL_DOMAIN ?? "iglesia.com").toLowerCase(),
  authorizedPersonalEmails: lista(process.env.AUTHORIZED_PERSONAL_EMAILS),
  adminEmails: lista(process.env.ADMIN_EMAILS),
  hostessEmails: lista(process.env.HOSTESS_EMAILS),
  registroEmails: lista(process.env.REGISTRO_EMAILS),
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME ?? "",
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY ?? "",
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET ?? "",
  resendApiKey: process.env.RESEND_API_KEY ?? "",
  resendFrom: process.env.RESEND_FROM ?? "Asistencia Iglesia <reportes@example.com>",
  churchName: process.env.CHURCH_NAME ?? "Nombre de la Iglesia",
  demoMode: booleano(process.env.DEMO_MODE, false),
});

export function validarConfiguracion() {
  if (env.demoMode) return;
  const requeridas = [
    ["GOOGLE_SHEET_ID", env.googleSheetId],
    ["GOOGLE_SERVICE_ACCOUNT_EMAIL", env.googleServiceAccountEmail],
    ["GOOGLE_PRIVATE_KEY", env.googlePrivateKey],
    ["FIREBASE_PROJECT_ID", env.firebaseProjectId],
    ["CLOUDINARY_CLOUD_NAME", env.cloudinaryCloudName],
    ["CLOUDINARY_API_KEY", env.cloudinaryApiKey],
    ["CLOUDINARY_API_SECRET", env.cloudinaryApiSecret],
  ];
  const faltantes = requeridas.filter(([, valor]) => !valor).map(([nombre]) => nombre);
  if (faltantes.length) throw new Error(`Faltan variables obligatorias: ${faltantes.join(", ")}`);
}
