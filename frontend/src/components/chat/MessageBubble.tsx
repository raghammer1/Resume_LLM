import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import type { Role } from "../../features/chat/types";

const Bubble = styled(Box, {
  shouldForwardProp: (prop) => prop !== "roleType",
})<{ roleType: Role }>(({ roleType }) => ({
  maxWidth: "82%",
  padding: "14px 16px",
  borderRadius: 20,
  lineHeight: 1.75,
  whiteSpace: "pre-wrap",
  alignSelf: roleType === "user" ? "flex-end" : "flex-start",
  background: roleType === "user" ? "#f5f7fb" : "rgba(255,255,255,0.07)",
  color: roleType === "user" ? "#111111" : "#f5f7fb",
  border:
    roleType === "assistant"
      ? "1px solid rgba(255,255,255,0.06)"
      : "1px solid rgba(255,255,255,0.12)",
}));

type MessageBubbleProps = {
  role: Role;
  content: string;
};

export default function MessageBubble({ role, content }: MessageBubbleProps) {
  return (
    <Bubble roleType={role}>
      <Typography variant="body1">{content}</Typography>
    </Bubble>
  );
}