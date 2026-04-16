import type { ChatResponse, Message } from "./types";

const API_BASE_URL = "http://127.0.0.1:8000";

export async function sendChatMessage(
  message: string,
  history: Message[],
): Promise<ChatResponse> {
  const response = await fetch(`${API_BASE_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      history,
    }),
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json() as Promise<ChatResponse>;
}