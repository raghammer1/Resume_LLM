from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.models import ChatRequest, ChatResponse
from app.controller import classify_message
from app.retriever import retrieve_context
from app.responder import generate_reply

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"status": "ok", "message": "personal-llm backend is running"}


@app.post("/chat", response_model=ChatResponse)
def chat(payload: ChatRequest) -> ChatResponse:
    control = classify_message(payload.message)
    context = retrieve_context(control.context_needed)
    reply = generate_reply(payload.message, context, control)

    return ChatResponse(reply=reply, intent=control.intent)