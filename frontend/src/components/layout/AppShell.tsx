import type { PropsWithChildren } from "react";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

const Shell = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  background:
    "radial-gradient(circle at top, rgba(124,140,255,0.12), transparent 28%), radial-gradient(circle at 20% 20%, rgba(158,197,255,0.10), transparent 22%), #07090f",
  color: theme.palette.text.primary,
}));

const Inner = styled(Box)(({ theme }) => ({
  maxWidth: 1220,
  margin: "0 auto",
  padding: theme.spacing(4, 2, 6),
  [theme.breakpoints.up("md")]: {
    padding: theme.spacing(5, 3, 8),
  },
}));

export default function AppShell({ children }: PropsWithChildren) {
  return (
    <Shell>
      <Inner>{children}</Inner>
    </Shell>
  );
}