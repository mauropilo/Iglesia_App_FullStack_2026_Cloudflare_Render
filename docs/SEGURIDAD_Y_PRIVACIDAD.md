# Seguridad y privacidad

La aplicación trata identificadores, contacto, afiliación religiosa y fotografías. Son datos de alta sensibilidad. Antes de producción:

- Obtén autorización informada, específica y verificable.
- Define finalidad, responsables, tiempo de retención y canal para consultar, corregir o eliminar datos.
- Evalúa la normativa colombiana aplicable con asesoría jurídica; este repositorio no sustituye esa revisión.
- Limita la hoja, Cloudinary y Resend por mínimo privilegio.
- Mantén claves únicamente en administradores de secretos.
- No registres cédulas completas, tokens ni contenido de correos en logs.
- Enmascara la cédula en tablas de uso general.
- Usa HTTPS y una política de contenido estricta.
- Conserva auditoría de altas, cambios de fotografía, asignaciones y envíos.
- Prueba restauración de copias de seguridad, no solo su creación.
- Elimina fotografías huérfanas cuando se reemplacen o borren registros.

## Amenazas prioritarias

| Riesgo | Control |
|---|---|
| Cuenta de Google comprometida | Revocación de tokens, MFA y allowlist |
| Elevación de privilegios desde frontend | Verificación de rol en cada ruta del backend |
| Fórmulas inyectadas en Sheets | Escritura RAW y validación; rechazar valores iniciados por `=`, `+`, `-` o `@` en campos libres si se exportan |
| Duplicado por doble escaneo | Bloqueo por cédula/fecha; restricción única al migrar a SQL |
| Exposición de fotos | Firma generada por el backend, carpetas controladas y política de eliminación |
| Envío masivo accidental | Vista previa y confirmación explícita |

## Estado de dependencias al entregar

Ejecuta `npm audit --omit=dev`, las pruebas y la compilación antes de cada despliegue. No apliques correcciones forzadas que cambien versiones principales sin validar autenticación, acceso a Google Sheets, carga de fotografías y envío de reportes.
