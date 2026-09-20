import { Box, Button, Card, CardContent, Container, Typography } from "@mui/material";
import { Google } from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";

export function LoginPage() {
  const { ingresar } = useAuth();
  return <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center", bgcolor: "background.default", p: 2 }}><Container maxWidth="sm"><Card><CardContent sx={{ p: { xs: 3, sm: 6 }, textAlign: "center" }}><Box sx={{ width: 68, height: 68, borderRadius: 4, display: "grid", placeItems: "center", bgcolor: "secondary.main", color: "primary.main", fontSize: 28, fontWeight: 900, mx: "auto", mb: 3 }}>CA</Box><Typography variant="h4" color="primary.main">Bienvenido</Typography><Typography color="text.secondary" sx={{ mt: 1, mb: 4 }}>Ingresa con una cuenta autorizada para gestionar la asistencia.</Typography><Button fullWidth variant="contained" startIcon={<Google />} onClick={ingresar}>Continuar con Google</Button></CardContent></Card></Container></Box>;
}
