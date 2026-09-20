import { useEffect, useMemo, useState } from "react";
import { Alert, Box, Card, CardContent, CircularProgress, Grid, Stack, Typography } from "@mui/material";
import { BarChart, LineChart } from "@mui/x-charts";
import { useAuth } from "../context/AuthContext";
import { crearApi } from "../services/api";

export function DashboardPage() {
  const { obtenerToken } = useAuth();
  const api = useMemo(() => crearApi(obtenerToken), [obtenerToken]);
  const [datos, setDatos] = useState(null); const [error, setError] = useState("");
  useEffect(() => { api.dashboard().then(setDatos).catch((e) => setError(e.message)); }, [api]);
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!datos) return <Box sx={{ display: "grid", placeItems: "center", minHeight: 300 }}><CircularProgress /></Box>;
  const tarjetas = [["Miembros activos", datos.totalActivos], ["Asistentes hoy", datos.asistentesHoy], ["Nuevos este mes", datos.nuevosMes], ["Requieren seguimiento", datos.inactivos]];
  return <Stack spacing={3}><Box><Typography variant="overline" color="secondary.dark">Resumen</Typography><Typography variant="h4" color="primary.main">Comunidad hoy</Typography></Box><Grid container spacing={2}>{tarjetas.map(([titulo, valor]) => <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={titulo}><Card><CardContent><Typography color="text.secondary">{titulo}</Typography><Typography variant="h3" color="primary.main" fontFamily="Georgia" mt={1}>{valor}</Typography></CardContent></Card></Grid>)}</Grid><Grid container spacing={2}><Grid size={{ xs: 12, lg: 7 }}><Card><CardContent><Typography variant="h6" fontWeight={800}>Tendencia de asistencia</Typography><LineChart height={300} xAxis={[{ data: ["Mar", "Abr", "May", "Jun", "Jul", "Ago"], scaleType: "point" }]} series={[{ data: [326, 351, 338, 389, 402, datos.asistentesHoy], color: "#1A3A5C" }]} /></CardContent></Card></Grid><Grid size={{ xs: 12, lg: 5 }}><Card><CardContent><Typography variant="h6" fontWeight={800}>Asistencia por zona</Typography><BarChart height={300} layout="horizontal" xAxis={[{ scaleType: "band", data: datos.porZona.map((x) => x.zona) }]} series={[{ data: datos.porZona.map((x) => x.total), color: "#C9A84C" }]} /></CardContent></Card></Grid></Grid></Stack>;
}
