import { createTheme } from "@mui/material/styles";
import { palette } from "./palette";
import { typography } from "./typography";

export const appTheme = createTheme({
  palette,
  typography,
  shape: {
    borderRadius: 20,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 16,
          fontWeight: 600,
        },
      },
    },
  },
});