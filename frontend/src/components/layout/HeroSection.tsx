import { Chip, Paper, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

const HeroWrap = styled(Paper)(({ theme }) => ({
  position: "relative",
  overflow: "hidden",
  padding: theme.spacing(4),
  borderRadius: 28,
  border: "1px solid rgba(255,255,255,0.08)",
  background:
    "linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03))",
  backdropFilter: "blur(12px)",
  boxShadow: "0 20px 80px rgba(0, 0, 0, 0.35)",
}));

export default function HeroSection() {
  return (
    <HeroWrap elevation={0}>
      <Stack spacing={2}>
        <Chip
          label="AI PROFILE"
          sx={{
            alignSelf: "flex-start",
            backgroundColor: "rgba(158,197,255,0.12)",
            color: "#cfe1ff",
            border: "1px solid rgba(158,197,255,0.22)",
            fontWeight: 600,
          }}
        />

        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: "2.3rem", md: "4.6rem" },
            lineHeight: 0.98,
            maxWidth: 900,
          }}
        >
          A digital version of me, designed to feel real.
        </Typography>

        <Typography
          variant="body1"
          sx={{
            maxWidth: 760,
            color: "text.secondary",
            fontSize: { xs: "1rem", md: "1.05rem" },
          }}
        >
          This is not meant to feel like a generic chatbot. It’s built to feel
          more like talking to me directly — across work, mindset, hobbies,
          values, personality, and the deeper stuff too.
        </Typography>

        <Stack direction="row" spacing={1.25} useFlexGap sx={{ flexWrap: "wrap" }}>
          <Chip label="Dev-built" variant="outlined" />
          <Chip label="AI-native" variant="outlined" />
          <Chip label="Personal context aware" variant="outlined" />
          <Chip label="Work + life + depth" variant="outlined" />
        </Stack>
      </Stack>
    </HeroWrap>
  );
}