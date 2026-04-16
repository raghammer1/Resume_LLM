import { Grid, Stack } from "@mui/material";
import AppShell from "../components/layout/AppShell";
import HeroSection from "../components/layout/HeroSection";
import ChatWindow from "../components/chat/ChatWindow";
import IdentityCard from "../components/profile/IdentityCard";
import QuickFacts from "../components/profile/QuickFacts";
import TopicCards from "../components/profile/TopicCards";
import { useChat } from "../features/chat/hooks/useChat";

export default function App() {
  const { messages, input, setInput, isLoading, sendMessage } = useChat();

  return (
    <AppShell>
      <Stack spacing={2.5}>
        <HeroSection />

        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, lg: 8 }}>
            <ChatWindow
              messages={messages}
              input={input}
              isLoading={isLoading}
              onInputChange={setInput}
              onSend={sendMessage}
            />
          </Grid>

          <Grid size={{ xs: 12, lg: 4 }}>
            <Stack spacing={2.5}>
              <IdentityCard />
              <QuickFacts />
            </Stack>
          </Grid>
        </Grid>

        <TopicCards onSelectPrompt={sendMessage} />
      </Stack>
    </AppShell>
  );
}