import { useMemo, useState } from "react";
import { Alert, Button, Card, CardContent, Divider, Grid, MenuItem, Stack, TextField, Typography } from "@mui/material";
import { Mail } from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import { crearApi } from "../services/api";

export function ReportsPage() {
  const { obtenerToken } = useAuth(); const api = useMemo(() => crearApi(obtenerToken), [obtenerToken]);
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10)); const [domingos, setDomingos] = useState(2); const [vista, setVista] = useState(null); const [mensaje, setMensaje] = useState("");
  async function preparar() { try { setVista(await api.vistaReporte(fecha, domingos)); setMensaje(""); } catch (e) { setMensaje(e.message); } }
  async function enviar() { if (!window.confirm(`¿Confirmas el envío a ${vista.reportes.length} líderes?`)) return; try { const r = await api.enviarReporte(fecha, domingos); setMensaje(`Reportes enviados a ${r.enviados} líderes.`); } catch (e) { setMensaje(e.message); } }
  return <Stack spacing={3}><Typography variant="h4" color="primary.main">Reportes de seguimiento</Typography>{mensaje && <Alert severity={mensaje.includes("enviados") ? "success" : "error"}>{mensaje}</Alert>}<Grid container spacing={3}><Grid size={{ xs: 12, lg: 5 }}><Card><CardContent><Stack spacing={2}><Typography variant="h6" fontWeight={800}>Configurar reporte</Typography><TextField type="date" label="Fecha de referencia" value={fecha} onChange={(e) => setFecha(e.target.value)} InputLabelProps={{ shrink: true }} /><TextField select label="Domingos sin asistir" value={domingos} onChange={(e) => setDomingos(Number(e.target.value))}>{[1,2,3,4].map((n) => <MenuItem value={n} key={n}>{n} domingo{n > 1 ? "s" : ""}</MenuItem>)}</TextField><Button variant="contained" startIcon={<Mail />} onClick={preparar}>Preparar vista previa</Button>{vista && <Button variant="outlined" color="secondary" onClick={enviar}>Confirmar y enviar</Button>}</Stack></CardContent></Card></Grid><Grid size={{ xs: 12, lg: 7 }}>{vista?.reportes.map((reporte) => <Card key={reporte.destinatario} sx={{ mb: 2 }}><CardContent><Typography fontWeight={800}>{reporte.asunto}</Typography><Typography color="text.secondary">Para: {reporte.destinatario} · {reporte.total} miembros</Typography><Divider sx={{ my: 2 }} /><Typography component="pre" sx={{ whiteSpace: "pre-wrap", fontFamily: "inherit", fontSize: 14 }}>{reporte.texto}</Typography></CardContent></Card>)}</Grid></Grid></Stack>;
}
