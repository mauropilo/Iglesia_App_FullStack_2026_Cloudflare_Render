import { useEffect, useMemo, useState } from "react";
import { Alert, Box, Button, Card, CardContent, CircularProgress, MenuItem, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { crearApi } from "../services/api";

export function AdminPage() {
  const { obtenerToken } = useAuth(); const api = useMemo(() => crearApi(obtenerToken), [obtenerToken]);
  const [nuevos, setNuevos] = useState(null); const [lideres, setLideres] = useState([]); const [seleccion, setSeleccion] = useState({}); const [mensaje, setMensaje] = useState("");
  async function cargar() { const [n, l] = await Promise.all([api.nuevos(), api.lideres()]); setNuevos(n.datos); setLideres(l.datos); }
  useEffect(() => { cargar().catch((e) => setMensaje(e.message)); }, []);
  async function mover(cedula) { try { await api.moverNuevo(cedula, seleccion[cedula]); setMensaje("Miembro asignado correctamente."); await cargar(); } catch (e) { setMensaje(e.message); } }
  if (!nuevos) return <Box sx={{ display: "grid", placeItems: "center", minHeight: 300 }}><CircularProgress /></Box>;
  return <Stack spacing={3}><Box><Typography variant="overline" color="secondary.dark">Administración</Typography><Typography variant="h4" color="primary.main">Asignar nuevos miembros</Typography><Typography color="text.secondary">Selecciona un líder y mueve el registro a la hoja Antiguos.</Typography></Box>{mensaje && <Alert severity={mensaje.includes("correctamente") ? "success" : "info"}>{mensaje}</Alert>}<Card><CardContent><TableContainer><Table aria-label="Miembros pendientes"><TableHead><TableRow><TableCell>Nombre</TableCell><TableCell>Cédula</TableCell><TableCell>Registro</TableCell><TableCell>Líder</TableCell><TableCell>Acción</TableCell></TableRow></TableHead><TableBody>{nuevos.map((item) => <TableRow key={item["Cédula"]}><TableCell>{item.Nombres} {item.Apellidos}</TableCell><TableCell>{item["Cédula"]}</TableCell><TableCell>{item.FechaRegistro}</TableCell><TableCell><TextField select value={seleccion[item["Cédula"]] ?? ""} onChange={(e) => setSeleccion({ ...seleccion, [item["Cédula"]]: e.target.value })} aria-label={`Líder para ${item.Nombres}`} sx={{ minWidth: 190 }}>{lideres.map((lider) => <MenuItem key={lider.Nombre} value={lider.Nombre}>{lider.Nombre} · {lider.ZonaAtención}</MenuItem>)}</TextField></TableCell><TableCell><Button variant="contained" disabled={!seleccion[item["Cédula"]]} onClick={() => mover(item["Cédula"])}>Mover a antiguos</Button></TableCell></TableRow>)}</TableBody></Table></TableContainer>{nuevos.length === 0 && <Typography textAlign="center" color="text.secondary" py={5}>No hay miembros pendientes.</Typography>}</CardContent></Card></Stack>;
}
