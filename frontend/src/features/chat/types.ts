export type Role = "user" | "assistant";

export type Message = {
  role: Role;
  content: string;
};

export type ChatResponse = {
  reply: string;
  intent: string;
};