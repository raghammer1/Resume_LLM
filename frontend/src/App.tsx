import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

type Role = "user" | "assistant";

type Message = {
  role: Role;
  content: string;
};

type ChatResponse = {
  reply: string;
  intent: string;
};

const starterPrompts = [
  "What kind of person are you?",
  "What do you do outside work?",
  "What are you like in love?",
  "Why would someone want to work with you?",
];

const PageShell = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  background: theme.palette.background.default,
  color: theme.palette.text.primary,
  padding: theme.spacing(4, 2),
}));

const ContentWrap = styled(Box)(({ theme }) => ({
  maxWidth: 1100,
  margin: "0 auto",
}));

const HeroCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 28,
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.04)",
  boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
  marginBottom: theme.spacing(2.5),
  backdropFilter: "blur(8px)",
}));

const ChatCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: 28,
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.04)",
  boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
  backdropFilter: "blur(8px)",
}));

const MessagesArea = styled(Box)(({ theme }) => ({
  height: "60vh",
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1.75),
  paddingRight: theme.spacing(0.5),
}));

const MessageBubble = styled(Box, {
  shouldForwardProp: (prop) => prop !== "roleType",
})<{ roleType: Role }>(({ theme, roleType }) => ({
  maxWidth: "82%",
  padding: theme.spacing(1.75, 2),
  borderRadius: 20,
  lineHeight: 1.7,
  whiteSpace: "pre-wrap",
  alignSelf: roleType === "user" ? "flex-end" : "flex-start",
  background: roleType === "user" ? "#f5f5f5" : "rgba(255,255,255,0.08)",
  color: roleType === "user" ? "#111111" : "#f5f5f5",
}));

const InputRow = styled("form")(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(1.5),
  marginTop: theme.spacing(2),
}));

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hey — this is basically my digital version. Ask me about work, personality, hobbies, values, or anything you're curious about.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const canSend = useMemo(
    () => input.trim().length > 0 && !isLoading,
    [input, isLoading],
  );

  async function sendMessage(messageText?: string) {
    const content = (messageText ?? input).trim();
    if (!content || isLoading) return;

    const nextUserMessage: Message = { role: "user", content };
    const nextMessages = [...messages, nextUserMessage];

    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: content,
          history: nextMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data: ChatResponse = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply,
        },
      ]);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong while talking to the backend.";

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Sorry — I hit an issue: ${message}`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    void sendMessage();
  }

  return (
    <PageShell>
      <ContentWrap>
        <HeroCard elevation={0}>
          <Typography
            variant="caption"
            sx={{
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              color: "text.secondary",
              display: "block",
              mb: 1.5,
            }}
          >
            Digital Me
          </Typography>

          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: "2rem", md: "3.5rem" },
              lineHeight: 1.05,
              fontWeight: 700,
            }}
          >
            Talk to my AI profile
          </Typography>

          <Typography
            sx={{
              mt: 2,
              maxWidth: 760,
              color: "text.secondary",
              lineHeight: 1.75,
            }}
          >
            This is meant to feel more like talking to me than reading a
            profile. Ask about work, personality, hobbies, values, or anything
            else you want to understand.
          </Typography>

          <Stack
            direction="row"
            spacing={1.25}
            useFlexGap
            sx={{ mt: 3, flexWrap: "wrap" }}
          >
            {starterPrompts.map((prompt) => (
              <Chip
                key={prompt}
                label={prompt}
                onClick={() => void sendMessage(prompt)}
                disabled={isLoading}
                variant="outlined"
                sx={{
                  color: "text.primary",
                  borderColor: "rgba(255,255,255,0.12)",
                  backgroundColor: "rgba(255,255,255,0.04)",
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.08)",
                  },
                }}
              />
            ))}
          </Stack>
        </HeroCard>

        <ChatCard elevation={0}>
          <MessagesArea>
            {messages.map((message, index) => (
              <MessageBubble
                key={`${message.role}-${index}`}
                roleType={message.role}
              >
                <Typography variant="body1">{message.content}</Typography>
              </MessageBubble>
            ))}

            {isLoading && (
              <MessageBubble roleType="assistant">
                <Stack direction="row" spacing={1.25} sx={{ alignItems: "center" }}>
                  <CircularProgress size={16} color="inherit" />
                  <Typography variant="body1">Thinking...</Typography>
                </Stack>
              </MessageBubble>
            )}
          </MessagesArea>

          <InputRow onSubmit={handleSubmit}>
            <TextField
              fullWidth
              placeholder="Ask me anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              variant="outlined"
              size="medium"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "18px",
                  backgroundColor: "rgba(255,255,255,0.04)",
                },
              }}
            />
            <Button
              type="submit"
              disabled={!canSend}
              variant="contained"
              sx={{
                borderRadius: "18px",
                px: 3,
                minWidth: 96,
                backgroundColor: "#fff",
                color: "#111",
                "&:hover": {
                  backgroundColor: "#ededed",
                },
              }}
            >
              Send
            </Button>
          </InputRow>
        </ChatCard>
      </ContentWrap>
    </PageShell>
  );
}

export default App;
