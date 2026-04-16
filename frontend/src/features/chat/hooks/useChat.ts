import { useMemo, useState } from "react";
import { sendChatMessage } from "../api";
import type { Message } from "../types";

const INITIAL_ASSISTANT_MESSAGE: Message = {
  role: "assistant",
  content:
    "This is basically my digital self. Ask about work, personality, values, hobbies, relationships, or anything else you're curious about.",
};

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([
    INITIAL_ASSISTANT_MESSAGE,
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
      // ! CODE BELOW IS FOR NON-STREAMING RESPONSE
      // const data = await sendChatMessage(
      //   content,
      //   nextMessages.map((m) => ({
      //     role: m.role,
      //     content: m.content,
      //   })),
      // );

      // setMessages((prev) => [
      //   ...prev,
      //   {
      //     role: "assistant",
      //     content: data.reply,
      //   },
      // ]);
      // ! CODE ABOVE IS FOR NON-STREAMING RESPONSE

      // ! CODE BELOW IS FOR STREAMING RESPONSE
      const response = await fetch("http://127.0.0.1:8000/chat-stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: content,
          history: nextMessages,
        }),
      });

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let assistantText = "";

      // 👇 create empty assistant message first
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        assistantText += chunk;

        // 👇 update last message live
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: assistantText,
          };
          return updated;
        });
      }
      // ! CODE ABOVE IS FOR STREAMING RESPONSE

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
