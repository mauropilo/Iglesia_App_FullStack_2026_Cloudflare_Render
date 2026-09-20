import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1A3A5C" },
    secondary: { main: "#C9A84C", contrastText: "#203040" },
    background: { default: "#F5F2EB", paper: "#FFFDF8" },
    text: { primary: "#2D2D2D", secondary: "#66727C" },
    success: { main: "#1F7657" },
  },
  shape: { borderRadius: 14 },
  typography: {
    fontFamily: 'Inter, Roboto, "Segoe UI", Arial, sans-serif',
    fontSize: 16,
    h4: { fontFamily: 'Georgia, "Times New Roman", serif', fontWeight: 600 },
    h5: { fontFamily: 'Georgia, "Times New Roman", serif', fontWeight: 600 },
    button: { textTransform: "none", fontWeight: 700 },
  },
  components: {
    MuiButton: { styleOverrides: { root: { minHeight: 48, borderRadius: 12 } } },
    MuiTextField: { defaultProps: { fullWidth: true, size: "small" } },
    MuiCard: { styleOverrides: { root: { border: "1px solid #E1DDD4", boxShadow: "0 12px 35px rgba(26,58,92,.06)" } } },
  },
});
