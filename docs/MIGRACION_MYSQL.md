# Migración futura a MySQL

La capa de servicios depende de contratos de repositorio, no de Google Sheets. Para migrar:

1. Implementa `MySqlMemberRepository`, `MySqlAttendanceRepository`, `MySqlLeaderRepository` y `MySqlConfigRepository` con los mismos métodos públicos.
2. Cambia la fábrica en `backend/src/repositories/index.js`.
3. Importa las hojas en tablas temporales, valida duplicados y ejecuta la migración final.
4. Conserva una ventana de solo lectura sobre Sheets para comparar resultados.

## Modelo propuesto

```sql
CREATE TABLE miembros (
  cedula VARCHAR(12) PRIMARY KEY,
  nombres VARCHAR(80) NOT NULL,
  apellidos VARCHAR(80) NOT NULL,
  celular VARCHAR(20),
  fecha_nacimiento DATE,
  sexo CHAR(1),
  estado VARCHAR(30) NOT NULL DEFAULT 'Activo',
  lider_id BIGINT NULL,
  zona_atencion VARCHAR(80),
  foto_url VARCHAR(500),
  tipo ENUM('NUEVO','ANTIGUO') NOT NULL DEFAULT 'NUEVO',
  fecha_registro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fecha_asignacion DATETIME NULL,
  INDEX idx_miembros_lider (lider_id),
  INDEX idx_miembros_tipo (tipo)
);

CREATE TABLE asistencias (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  cedula VARCHAR(12) NOT NULL,
  fecha DATE NOT NULL,
  hora TIME NOT NULL,
  zona VARCHAR(80),
  creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_asistencia_miembro FOREIGN KEY (cedula) REFERENCES miembros(cedula),
  CONSTRAINT uk_asistencia_dia UNIQUE (cedula, fecha),
  INDEX idx_asistencia_fecha (fecha)
);
```

La restricción `UNIQUE (cedula, fecha)` reemplaza la protección de concurrencia en memoria y permite varias instancias de backend de forma segura.
