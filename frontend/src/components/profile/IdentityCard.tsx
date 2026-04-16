import { Avatar, Paper, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

const Card = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2.5),
  borderRadius: 24,
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.04)",
}));

export default function IdentityCard() {
  return (
    <Card elevation={0}>
      <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
        <Avatar
          sx={{
            width: 56,
            height: 56,
            bgcolor: "rgba(158,197,255,0.14)",
            color: "#cfe1ff",
            fontWeight: 700,
          }}
        >
          AI
        </Avatar>

        <Stack spacing={0.5}>
          <Typography variant="subtitle2" sx={{ color: "text.secondary", letterSpacing: "0.08em" }}>
            DIGITAL IDENTITY
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 650 }}>
            Built to feel like talking to me
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Not just facts — tone, values, style, and how I naturally respond.
          </Typography>
        </Stack>
      </Stack>
    </Card>
  );
}