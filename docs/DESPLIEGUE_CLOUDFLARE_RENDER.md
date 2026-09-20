# Despliegue gratuito: Cloudflare Pages + Render

Esta guía publica el frontend React/Vite en Cloudflare Pages y la API Express en Render. Incluye dos recorridos:

- **Demo:** no usa datos reales y permite comprobar el despliegue.
- **Producción piloto:** activa Firebase Auth, Google Sheets, Cloudinary y Resend.

## 1. Arquitectura

```mermaid
flowchart LR
    U["Usuario y lector"] --> CF["Cloudflare Pages<br/>React + Vite"]
    CF --> FA["Firebase Authentication"]
    CF --> R["Render<br/>API Express"]
    R --> GS["Google Sheets"]
    R --> CL["Cloudinary"]
    R --> RE["Resend HTTPS"]
```

## 2. Requisitos

1. Cuenta de GitHub.
2. Cuenta de Cloudflare.
3. Cuenta de Render.
4. Node.js 22 para trabajar localmente.
5. Para producción: Firebase, Google Cloud, Cloudinary y Resend.

Nunca subas archivos `.env`, llaves JSON ni claves privadas a GitHub.

## 3. Verificación local

Desde la raíz del proyecto:

```bash
npm install
```

En Windows PowerShell crea los archivos de entorno:

```powershell
Copy-Item backend/.env.example backend/.env
Copy-Item frontend/.env.example frontend/.env
```

En Git Bash, macOS o Linux:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Mantén estas variables para la demostración:

```env
# backend/.env
DEMO_MODE=true
FRONTEND_URLS=http://localhost:5173
```

```env
# frontend/.env
VITE_API_URL=http://localhost:4000/api
VITE_DEMO_MODE=true
```

Ejecuta:

```bash
npm run test
npm run build
npm run dev
```

Abre `http://localhost:5173` y prueba el lector con:

```text
1012345678 ROJAS PEREZ SOFIA ELENA F 19920618 O+
```

## 4. Subir el proyecto a GitHub

1. Crea un repositorio privado, por ejemplo `iglesia-app`.
2. Descomprime este ZIP.
3. Abre la carpeta en Visual Studio Code.
4. Ejecuta:

```bash
git init
git add .
git commit -m "Preparar despliegue Cloudflare y Render"
git branch -M main
git remote add origin URL_DE_TU_REPOSITORIO
git push -u origin main
```

Verifica en GitHub que no existan `backend/.env`, `frontend/.env` ni archivos JSON con credenciales.

## 5. Publicar primero el backend en Render

### Opción recomendada: Blueprint

1. En Render selecciona **New > Blueprint**.
2. Conecta el repositorio de GitHub.
3. Render detectará `render.yaml`.
4. Crea el servicio `iglesia-app-api`.
5. Para la primera prueba conserva `DEMO_MODE=true`.
6. En `FRONTEND_URLS` escribe temporalmente:

```text
http://localhost:5173
```

7. Espera que el estado cambie a **Live**.
8. Copia la URL, por ejemplo:

```text
https://iglesia-app-api.onrender.com
```

9. Comprueba:

```text
https://iglesia-app-api.onrender.com/health
```

Respuesta esperada:

```json
{ "estado": "ok", "modo": "demo" }
```

### Configuración manual equivalente

| Campo | Valor |
|---|---|
| Service type | Web Service |
| Root directory | `backend` |
| Runtime | Node |
| Build command | `npm install` |
| Start command | `npm start` |
| Health check | `/health` |
| Plan | Free |

Render puede tardar cerca de un minuto en responder después de quince minutos de inactividad. Esto es normal en el plan gratuito.

## 6. Publicar el frontend en Cloudflare Pages

1. Abre Cloudflare Dashboard.
2. Entra a **Workers & Pages**.
3. Selecciona **Create > Pages > Import an existing Git repository**.
4. Conecta GitHub y selecciona `iglesia-app`.
5. Configura:

| Campo | Valor |
|---|---|
| Production branch | `main` |
| Root directory | `frontend` |
| Framework preset | Vite |
| Build command | `npm run build` |
| Build output directory | `dist` |

6. Agrega variables de construcción:

```env
NODE_VERSION=22
VITE_API_URL=https://iglesia-app-api.onrender.com/api
VITE_DEMO_MODE=true
```

7. Selecciona **Save and Deploy**.
8. Cloudflare entregará una dirección similar a:

```text
https://iglesia-app.pages.dev
```

El archivo `public/_redirects` ya está incluido para que rutas como `/registro` y `/reportes` funcionen al recargar la página.

## 7. Conectar Cloudflare con Render

Regresa a Render y cambia `FRONTEND_URLS` por el dominio real, sin barra final:

```env
FRONTEND_URLS=https://iglesia-app.pages.dev
```

Si también utilizarás un dominio propio y desarrollo local:

```env
FRONTEND_URLS=http://localhost:5173,https://iglesia-app.pages.dev,https://asistencia.tuiglesia.org
```

Guarda y reinicia el servicio. Abre el dominio de Cloudflare y prueba un escaneo.

## 8. Activar producción piloto

Realiza esta sección solo después de comprobar la demo.

### 8.1 Google Sheets

1. Habilita Google Sheets API en Google Cloud.
2. Crea una cuenta de servicio.
3. Obtén su correo y clave privada.
4. Inicializa la hoja siguiendo `CONFIGURACION_SHEETS.md`.
5. Comparte la hoja con el correo de la cuenta de servicio como editor.
6. En Render configura:

```env
GOOGLE_SHEET_ID=identificador_de_la_hoja
GOOGLE_SERVICE_ACCOUNT_EMAIL=cuenta-servicio@proyecto.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### 8.2 Firebase Authentication

1. Crea un proyecto de Firebase.
2. Activa **Authentication > Sign-in method > Google**.
3. Registra una aplicación web.
4. En Firebase agrega `iglesia-app.pages.dev` en **Authentication > Settings > Authorized domains**.
5. En Cloudflare Pages configura:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_APP_ID=
VITE_DEMO_MODE=false
```

6. En Render configura las credenciales de Firebase Admin:

```env
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### 8.3 Usuarios y roles

Configura en Render:

```env
ALLOWED_EMAIL_DOMAIN=tuiglesia.org
AUTHORIZED_PERSONAL_EMAILS=persona@gmail.com
ADMIN_EMAILS=administrador@tuiglesia.org
HOSTESS_EMAILS=hostess@tuiglesia.org
REGISTRO_EMAILS=registro@tuiglesia.org
```

Separa varias cuentas con comas. Una cuenta autorizada también debe aparecer en una de las listas de roles.

### 8.4 Fotografías en Cloudinary

1. Crea una cuenta en Cloudinary.
2. Copia **Cloud name**, **API key** y **API secret**.
3. Agrégalas únicamente en Render:

```env
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

El navegador solicita al backend una firma temporal. La clave secreta nunca llega al frontend.

### 8.5 Correos con Resend

1. Agrega y verifica un dominio en Resend.
2. Crea una API key.
3. Configura en Render:

```env
RESEND_API_KEY=re_...
RESEND_FROM="Asistencia Iglesia <reportes@tuiglesia.org>"
CHURCH_NAME=Nombre de la Iglesia
```

Si todavía no tienes dominio verificado, deja el envío pendiente y utiliza únicamente la vista previa del reporte.

### 8.6 Cambiar el backend a producción

Cuando todas las variables estén completas, cambia en Render:

```env
DEMO_MODE=false
NODE_ENV=production
```

Render reiniciará el servicio. Después, solicita en Cloudflare Pages un nuevo despliegue para que `VITE_DEMO_MODE=false` quede incorporado al frontend.

## 9. Pruebas posteriores al despliegue

1. `/health` responde `modo: produccion`.
2. Una cuenta no autorizada recibe acceso denegado.
3. Administrador, Hostess y Registro ven únicamente sus módulos.
4. El primer escaneo registra una asistencia.
5. El segundo escaneo del mismo día devuelve `YA_REGISTRADO`.
6. Un miembro nuevo queda en la hoja `Nuevos`.
7. La foto aparece en Cloudinary y su URL queda en Sheets.
8. La vista previa del reporte no envía correos.
9. El envío confirmado llega al líder correcto.
10. Las rutas `/registro` y `/reportes` cargan al abrirlas directamente.

## 10. Errores frecuentes

| Error | Causa probable | Solución |
|---|---|---|
| CORS u origen no permitido | `FRONTEND_URLS` no coincide exactamente | Copia el dominio sin barra final y reinicia Render |
| 401 `TOKEN_AUSENTE` | No hay sesión o `VITE_DEMO_MODE` no corresponde al backend | Revisa ambos modos demo y vuelve a desplegar |
| 403 `ROL_NO_ASIGNADO` | El correo no está en una lista de roles | Agrégalo en Render y reinicia |
| Render tarda en responder | Instancia gratuita suspendida | Espera cerca de un minuto y vuelve a intentar |
| Firma de Cloudinary inválida | Clave incorrecta o variables incompletas | Revisa las tres variables únicamente en Render |
| Resend rechaza el correo | Dominio/remitente no verificado | Verifica el dominio y corrige `RESEND_FROM` |
| Google devuelve permiso denegado | La hoja no está compartida | Comparte la hoja con la cuenta de servicio |
| La ruta muestra 404 al recargar | `_redirects` no llegó a `dist` | Comprueba que `frontend/public/_redirects` exista y redespliega |

## 11. Actualizaciones posteriores

Cada `git push` a `main` inicia despliegues automáticos en Render y Cloudflare Pages. Antes de enviar cambios ejecuta:

```bash
npm run test
npm run build
```

Para producción continua, considera migrar el backend a Railway Hobby o Google Cloud Run y los datos a PostgreSQL cuando aumente la concurrencia.
