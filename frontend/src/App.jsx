import { Navigate, Route, Routes } from "react-router-dom";
import { CircularProgress, Box } from "@mui/material";
import { useAuth } from "./context/AuthContext";
import { AppLayout } from "./components/common/AppLayout";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { RegistroPage } from "./pages/RegistroPage";
import { AdminPage } from "./pages/AdminPage";
import { ReportsPage } from "./pages/ReportsPage";

function Protegida({ roles, children }) {
  const { usuario, cargando } = useAuth();
  if (cargando) return <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center" }}><CircularProgress /></Box>;
  if (!usuario) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(usuario.rol)) return <Navigate to="/registro" replace />;
  return children;
}

export default function App() {
  return <Routes><Route path="/login" element={<LoginPage />} /><Route element={<Protegida><AppLayout /></Protegida>}><Route index element={<Protegida roles={["administrador", "hostess"]}><DashboardPage /></Protegida>} /><Route path="registro" element={<Protegida roles={["administrador", "registro"]}><RegistroPage /></Protegida>} /><Route path="administracion" element={<Protegida roles={["administrador"]}><AdminPage /></Protegida>} /><Route path="reportes" element={<Protegida roles={["administrador"]}><ReportsPage /></Protegida>} /></Route><Route path="*" element={<Navigate to="/" replace />} /></Routes>;
}
