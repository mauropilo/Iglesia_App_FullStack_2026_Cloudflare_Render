import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { AppBar, Avatar, Box, Chip, Drawer, IconButton, List, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography } from "@mui/material";
import { AdminPanelSettings, Assessment, Dashboard, Menu, QrCodeScanner } from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";

const ancho = 264;
const opciones = [
  { ruta: "/", texto: "Dashboard", icono: <Dashboard /> , roles: ["administrador", "hostess"] },
  { ruta: "/registro", texto: "Registro", icono: <QrCodeScanner />, roles: ["administrador", "registro"] },
  { ruta: "/administracion", texto: "Administración", icono: <AdminPanelSettings />, roles: ["administrador"] },
  { ruta: "/reportes", texto: "Reportes", icono: <Assessment />, roles: ["administrador"] },
];

export function AppLayout() {
  const { usuario } = useAuth();
  const [movil, setMovil] = useState(false);
  const menu = <Box sx={{ height: "100%", bgcolor: "#122D48", color: "white", p: 2 }}><Box sx={{ display: "flex", alignItems: "center", gap: 1.5, p: 1, mb: 3 }}><Avatar sx={{ bgcolor: "secondary.main", color: "primary.main", fontWeight: 900 }}>CA</Avatar><Box><Typography fontWeight={800}>Casa Abierta</Typography><Typography variant="caption" sx={{ color: "#B8C8D6" }}>Gestión de asistencia</Typography></Box></Box><List>{opciones.filter((item) => item.roles.includes(usuario.rol)).map((item) => <ListItemButton component={NavLink} to={item.ruta} key={item.ruta} onClick={() => setMovil(false)} sx={{ borderRadius: 2, mb: 1, color: "#D7E0E7", "&.active": { bgcolor: "rgba(255,255,255,.12)", color: "white", borderLeft: "3px solid #C9A84C" } }}><ListItemIcon sx={{ color: "inherit", minWidth: 42 }}>{item.icono}</ListItemIcon><ListItemText primary={item.texto} /></ListItemButton>)}</List></Box>;
  return <Box sx={{ display: "flex", minHeight: "100vh" }}><AppBar position="fixed" color="inherit" elevation={0} sx={{ ml: { md: `${ancho}px` }, width: { md: `calc(100% - ${ancho}px)` }, borderBottom: "1px solid #E1DDD4" }}><Toolbar><IconButton onClick={() => setMovil(true)} sx={{ display: { md: "none" }, mr: 1 }} aria-label="Abrir menú"><Menu /></IconButton><Box sx={{ flex: 1 }}><Typography variant="overline" color="secondary.dark">Gestión pastoral</Typography><Typography variant="h6" color="primary.main" fontWeight={800}>Registro de Asistencia</Typography></Box><Chip label={usuario.rol} color="primary" variant="outlined" /><Avatar sx={{ ml: 1.5, bgcolor: "secondary.main", color: "primary.main" }}>{usuario.displayName?.[0] ?? "U"}</Avatar></Toolbar></AppBar><Drawer variant="permanent" sx={{ display: { xs: "none", md: "block" }, width: ancho, "& .MuiDrawer-paper": { width: ancho, border: 0 } }}>{menu}</Drawer><Drawer open={movil} onClose={() => setMovil(false)} sx={{ display: { md: "none" }, "& .MuiDrawer-paper": { width: ancho } }}>{menu}</Drawer><Box component="main" sx={{ flex: 1, minWidth: 0, mt: 8, ml: { md: `${ancho}px` }, p: { xs: 2, sm: 3, lg: 4 } }}><Outlet /></Box></Box>;
}
