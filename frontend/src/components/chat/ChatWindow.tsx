import { Paper, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import type { Message } from "../../features/chat/types";
import ChatInput from "./ChatInput";
import MessageList from "./MessageList";
import StarterPrompts from "./StarterPrompts";

const Card = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: 28,
  border: "1px solid rgba(255,255,255,0.08)",
  background: "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.035))",
  boxShadow: "0 20px 80px rgba(0,0,0,0.35)",
  backdropFilter: "blur(10px)",
}));

type ChatWindowProps = {
  messages: Message[];
  input: string;
  isLoading: boolean;
  onInputChange: (value: string) => void;
  onSend: (messageText?: string) => void;
};

export default function ChatWindow({
  messages,
  input,
  isLoading,
  onInputChange,
  onSend,
}: ChatWindowProps) {
  return (
    <Card elevation={0}>
      <Stack spacing={2}>
        <Stack spacing={1}>
          <Typography variant="h6" sx={{ fontWeight: 650 }}>
            Live conversation
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Ask directly, follow up naturally, or use one of the suggested prompts.
          </Typography>
        </Stack>

        <StarterPrompts onSelectPrompt={onSend} disabled={isLoading} />

        <MessageList messages={messages} isLoading={isLoading} />

        <ChatInput
          value={input}
          onChange={onInputChange}
          onSubmit={() => onSend()}
          disabled={isLoading}
        />
      </Stack>
    </Card>
  );
}