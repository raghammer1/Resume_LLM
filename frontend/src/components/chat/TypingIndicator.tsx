import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

const Bubble = styled(Box)(() => ({
  maxWidth: "82%",
  padding: "14px 16px",
  borderRadius: 20,
  lineHeight: 1.7,
  alignSelf: "flex-start",
  background: "rgba(255,255,255,0.07)",
  color: "#f5f7fb",
  border: "1px solid rgba(255,255,255,0.06)",
}));

const DotRow = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(0.75),
}));

const Dot = styled("span")(({ theme }) => ({
  width: 6,
  height: 6,
  borderRadius: "50%",
  background: "rgba(255,255,255,0.75)",
  display: "inline-block",
  animation: "pulse 1.2s infinite ease-in-out",
  "&:nth-of-type(2)": {
    animationDelay: "0.15s",
  },
  "&:nth-of-type(3)": {
    animationDelay: "0.3s",
  },
  "@keyframes pulse": {
    "0%, 80%, 100%": {
      opacity: 0.3,
      transform: "translateY(0)",
    },
    "40%": {
      opacity: 1,
      transform: "translateY(-2px)",
    },
  },
}));

export default function TypingIndicator() {
  return (
    <Bubble>
      <DotRow>
        <Dot />
        <Dot />
        <Dot />
        <Typography variant="body2" sx={{ color: "text.secondary", ml: 0.5 }}>
          Thinking
        </Typography>
      </DotRow>
    </Bubble>
  );
}