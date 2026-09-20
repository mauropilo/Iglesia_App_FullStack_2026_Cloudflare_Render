import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { auth, proveedorGoogle } from "../config/firebase";

const AuthContext = createContext(null);
const demo = import.meta.env.VITE_DEMO_MODE === "true";

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(demo ? { displayName: "Administrador Demo", email: "admin@iglesia.com", rol: "administrador" } : null);
  const [cargando, setCargando] = useState(!demo);

  useEffect(() => {
    if (demo) return undefined;
    return onAuthStateChanged(auth, async (actual) => {
      setUsuario(actual ? { ...actual, rol: "administrador" } : null);
      setCargando(false);
    });
  }, []);

  async function ingresar() {
    if (demo) return;
    await signInWithPopup(auth, proveedorGoogle);
  }
  async function salir() {
    if (demo) return setUsuario(null);
    await signOut(auth);
  }
  async function obtenerToken() {
    if (demo) return "demo-token";
    return auth.currentUser?.getIdToken() ?? "";
  }

  const valor = useMemo(() => ({ usuario, cargando, ingresar, salir, obtenerToken }), [usuario, cargando]);
  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
