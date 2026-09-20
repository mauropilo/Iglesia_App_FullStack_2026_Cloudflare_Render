# Referencia de la API

Base local: `http://localhost:4000/api`

Todas las rutas requieren `Authorization: Bearer <Firebase ID token>`.

| Método | Ruta | Roles | Propósito |
|---|---|---|---|
| POST | `/asistencias/escanear` | Administrador, Registro | Parsear el documento y registrar la primera asistencia del día |
| GET | `/dashboard` | Administrador, Hostess | Obtener métricas e inactivos |
| GET | `/miembros/nuevos` | Administrador, Registro | Listar pendientes |
| POST | `/miembros/nuevos` | Administrador, Registro | Crear miembro nuevo |
| POST | `/miembros/nuevos/:cedula/mover` | Administrador | Asignar líder y mover a Antiguos |
| PUT | `/miembros/:cedula/foto` | Administrador, Registro | Actualizar URL de fotografía |
| POST | `/archivos/fotos/firma` | Administrador, Registro | Crear una firma temporal para cargar una fotografía a Cloudinary |
| GET/POST | `/lideres` | Según método | Listar o crear líderes |
| PUT/DELETE | `/lideres/:fila` | Administrador | Modificar o eliminar líder |
| GET/PUT | `/configuracion` | Administrador | Consultar o cambiar parámetros |
| POST | `/reportes/inasistencia/preview` | Administrador | Preparar correos sin enviarlos |
| POST | `/reportes/inasistencia/enviar` | Administrador | Enviar reportes confirmados |

## Escaneo

```json
{
  "datosEscaneo": "1012345678 ROJAS PEREZ SOFIA ELENA F 19920618 O+"
}
```

Respuestas posibles: `REGISTRADO`, `YA_REGISTRADO` o `REQUIERE_REGISTRO`.

## Envío de reportes

```json
{
  "fecha": "2026-08-23",
  "domingos": 2,
  "confirmacion": "ENVIAR_REPORTES"
}
```

Usa primero `preview`; la confirmación no debe enviarse automáticamente desde una carga de página.

## Errores

```json
{
  "error": {
    "codigo": "FORMATO_ESCANEO_INVALIDO",
    "mensaje": "No fue posible interpretar los datos del documento."
  }
}
```
