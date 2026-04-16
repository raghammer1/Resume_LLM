import { useMemo, useState } from "react";
import { sendChatMessage } from "../api";
import type { Message } from "../types";

const INITIAL_ASSISTANT_MESSAGE: Message = {
  role: "assistant",
  content:
    "This is basically my digital self. Ask about work, personality, values, hobbies, relationships, or anything else you're curious about.",
};

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_ASSISTANT_MESSAGE]);
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
      const data = await sendChatMessage(
        content,
        nextMessages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      );

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply,
        },
      ]);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Something went wrong while talking to the backend.";

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Sorry — I hit an issue: ${errorMessage}`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  return {
    messages,
    input,
    setInput,
    isLoading,
    canSend,
    sendMessage,
  };
}