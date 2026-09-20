import { useCallback, useMemo, useState } from "react";
import { Alert, Box, Button, Card, CardContent, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Grid, MenuItem, Stack, TextField, Typography } from "@mui/material";
import { CheckCircle, QrCodeScanner } from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import { useScanner } from "../hooks/useScanner";
import { crearApi } from "../services/api";
import { CameraCapture } from "../components/scan/CameraCapture";
import { subirFoto } from "../services/photoService";

const inicial = { cedula: "", nombres: "", apellidos: "", celular: "", fechaNacimiento: "", sexo: "F", etapa: "", lugarNacimiento: "", direccion: "", correo: "", estado: "Activo", fechaSalvacion: "", localidad: "", reunionZonal: "", liderZonal: "", zonaAtencion: "", fotoUrl: "" };

export function RegistroPage() {
  const { obtenerToken } = useAuth(); const api = useMemo(() => crearApi(obtenerToken), [obtenerToken]);
  const [entrada, setEntrada] = useState(""); const [estado, setEstado] = useState(null); const [error, setError] = useState("");
  const [abierto, setAbierto] = useState(false); const [formulario, setFormulario] = useState(inicial); const [foto, setFoto] = useState(null);

  const procesar = useCallback(async (valor) => {
    setError("");
    try {
      const respuesta = await api.escanear(valor);
      if (respuesta.estado === "REQUIERE_REGISTRO") {
        setFormulario({ ...inicial, ...respuesta.datosDocumento }); setAbierto(true); setEstado(null);
      } else setEstado(respuesta);
    } catch (e) { setError(e.message); }
  }, [api]);
  useScanner(procesar);

  async function guardar(evento) {
    evento.preventDefault();
    try {
      let fotoUrl = "";
      if (foto) fotoUrl = await subirFoto(formulario.cedula, foto, api.firmarFoto);
      await api.crearNuevo({ ...formulario, fotoUrl });
      const respuesta = await api.escanear(`${formulario.cedula} ${formulario.apellidos.toUpperCase().split(" ").slice(0,2).join(" ")} ${formulario.nombres.toUpperCase().split(" ").slice(0,2).join(" ")} ${formulario.sexo} ${formulario.fechaNacimiento.replaceAll("-", "")} O+`);
      setEstado(respuesta); setAbierto(false);
    } catch (e) { setError(e.message); }
  }

  return <Stack spacing={3}><Box><Chip icon={<QrCodeScanner />} label="LISTO PARA ESCANEAR" color="success" /><Typography variant="h4" color="primary.main" mt={2}>Acerca el documento al lector</Typography><Typography color="text.secondary">El lector Newland funciona como teclado y envía el registro al presionar Enter.</Typography></Box><Card><CardContent sx={{ p: { xs: 2, sm: 4 } }}><Stack component="form" direction={{ xs: "column", sm: "row" }} spacing={1} onSubmit={(e) => { e.preventDefault(); procesar(entrada); }}><TextField label="Datos recibidos del documento" value={entrada} onChange={(e) => setEntrada(e.target.value)} autoFocus inputProps={{ "aria-label": "Datos escaneados del documento" }} /><Button type="submit" variant="contained" startIcon={<QrCodeScanner />}>Procesar</Button></Stack>{error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}{estado?.estado === "YA_REGISTRADO" && <Alert severity="warning" sx={{ mt: 2 }}>{estado.nombre} ya registró hoy a las {estado.hora}</Alert>}{estado?.estado === "REGISTRADO" && <Alert icon={<CheckCircle />} severity="success" sx={{ mt: 2 }}><strong>{estado.nombre}</strong> registrado a las {estado.hora}. Zona {estado.zona}; líder {estado.lider}.</Alert>}</CardContent></Card><Dialog open={abierto} onClose={() => setAbierto(false)} maxWidth="md" fullWidth><Box component="form" onSubmit={guardar}><DialogTitle>Completar registro de miembro nuevo</DialogTitle><DialogContent><Grid container spacing={2} mt={0}>{[["cedula", "Cédula"], ["nombres", "Nombres"], ["apellidos", "Apellidos"], ["celular", "Celular"], ["fechaNacimiento", "Fecha de nacimiento", "date"], ["etapa", "Etapa"], ["lugarNacimiento", "Lugar de nacimiento"], ["direccion", "Dirección"], ["correo", "Correo", "email"], ["fechaSalvacion", "Fecha de salvación", "date"], ["localidad", "Localidad"], ["reunionZonal", "Reunión zonal"]].map(([campo, etiqueta, tipo]) => <Grid size={{ xs: 12, sm: 6 }} key={campo}><TextField label={etiqueta} type={tipo ?? "text"} value={formulario[campo]} onChange={(e) => setFormulario({ ...formulario, [campo]: e.target.value })} InputLabelProps={tipo === "date" ? { shrink: true } : undefined} required={["cedula", "nombres", "apellidos", "celular", "fechaNacimiento"].includes(campo)} /></Grid>)}<Grid size={{ xs: 12, sm: 6 }}><TextField select label="Sexo" value={formulario.sexo} onChange={(e) => setFormulario({ ...formulario, sexo: e.target.value })}><MenuItem value="F">Femenino</MenuItem><MenuItem value="M">Masculino</MenuItem><MenuItem value="X">Otro / no especifica</MenuItem></TextField></Grid><Grid size={{ xs: 12 }}><CameraCapture alCapturar={setFoto} />{foto && <Alert severity="success" sx={{ mt: 1 }}>Foto capturada y lista para comprimir.</Alert>}</Grid></Grid></DialogContent><DialogActions sx={{ p: 3 }}><Button onClick={() => setAbierto(false)}>Cancelar</Button><Button type="submit" variant="contained">Guardar y registrar asistencia</Button></DialogActions></Box></Dialog></Stack>;
}
