from pydantic import BaseModel, Field
from typing import Literal, List


Intent = Literal["about_me","career", "personal", "values", "hobbies", "general", "playful", "love"]
Tone = Literal["professional", "casual", "reflective", "playful"]
Depth = Literal["short", "medium", "deep"]


class Message(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1)
    history: List[Message] = []


class ControllerOutput(BaseModel):
    intent: Intent
    tone: Tone
    depth: Depth
    context_needed: List[str]


class ChatResponse(BaseModel):
    reply: str
    intent: Intent