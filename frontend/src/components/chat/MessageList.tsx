import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import type { Message } from "../../features/chat/types";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";

const Wrap = styled(Box)(({ theme }) => ({
  height: "58vh",
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1.5),
  paddingRight: theme.spacing(0.5),
}));

type MessageListProps = {
  messages: Message[];
  isLoading: boolean;
};

export default function MessageList({ messages, isLoading }: MessageListProps) {
  return (
    <Wrap>
      {messages.map((message, index) => (
        <MessageBubble
          key={`${message.role}-${index}`}
          role={message.role}
          content={message.content}
        />
      ))}

      {isLoading && <TypingIndicator />}
    </Wrap>
  );
}