import React from "react";
import ReactDOM from "react-dom/client";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import App from "./App";

const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#0a0a0a",
      paper: "rgba(255,255,255,0.04)",
    },
    text: {
      primary: "#f5f5f5",
      secondary: "#b3b3b3",
    },
  },
  shape: {
    borderRadius: 20,
  },
  typography: {
    fontFamily:
      'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);