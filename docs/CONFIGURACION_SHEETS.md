# Configuración de Google Sheets

## 1. Crear el proyecto técnico

1. Crea un proyecto en Google Cloud.
2. Habilita **Google Sheets API**.
3. Crea una cuenta de servicio exclusiva para esta aplicación.
4. Descarga la clave JSON una sola vez y transfiere sus campos a las variables de entorno.
5. No subas el JSON ni el archivo `.env` al repositorio.

## 2. Inicializar las hojas

Ejecuta desde `backend/`:

```bash
node ../scripts/init_sheets.js
```

Si `GOOGLE_SHEET_ID` está vacío, el script crea un libro nuevo. Si contiene un ID, crea únicamente las pestañas faltantes y establece sus encabezados.

## 3. Conceder acceso

Comparte el libro con el valor de `GOOGLE_SERVICE_ACCOUNT_EMAIL` y dale permiso de **editor**. La cuenta de servicio no obtiene acceso automáticamente por pertenecer al proyecto de Google Cloud.

## 4. Formatos recomendados

- `Cédula`: texto sin formato para conservar ceros iniciales.
- `FechaNac`, `FechaSalvación`, `FechaRegistro` y `Fecha`: `YYYY-MM-DD`.
- `Hora`: `HH:MM:SS`.
- Protege la primera fila de cada hoja.
- Restringe la edición manual de `Asistencia` y `Nuevos`.

## 5. Seguridad operativa

- Una hoja de producción no debe compartirse mediante enlace público.
- Limita los editores humanos.
- Activa alertas de acceso y revisa periódicamente la actividad.
- Rota la clave de la cuenta de servicio.
- Exporta una copia de seguridad cifrada cada semana.
- No almacenes fotografías como Base64 en celdas; guarda solo una URL controlada.

## 6. Concurrencia

La cola incluida evita que una sola instancia escriba varias filas simultáneamente. No coordina dos servidores distintos. Render debe ejecutarse inicialmente con una sola instancia. Si se requiere escalado horizontal, migra la persistencia a una base relacional con una restricción única sobre `(cedula, fecha)`.
