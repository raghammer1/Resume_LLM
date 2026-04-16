import os
from dotenv import load_dotenv
from openai import OpenAI
from app.models import ControllerOutput
from typing import List
from app.models import ControllerOutput, Message


load_dotenv()

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY", "ollama"),
    base_url=os.getenv("OPENAI_BASE_URL", "http://localhost:11434/v1"),
)

MODEL_NAME = os.getenv("OLLAMA_MODEL", "llama3")


def generate_reply(user_message: str, context: str, control: ControllerOutput,history: List[Message],) -> str:
    system_prompt = f"""
You are a digital version of a real person.

Your goal is to make the user feel like they are talking to him naturally.

Hard rules:
- Always speak in first person.
- Sound human, grounded, warm, and self-aware.
- Be natural and conversational.
- Do not sound like a therapist, dating coach, motivational speaker, or corporate bio.
- Do not use cheesy, exaggerated, dramatic, or overly poetic language.
- Do not invent stories, claims, or social proof.
- Do not say things like "just ask my loved ones", "I'm a hopeless romantic", or other fluffy phrases unless explicitly supported by context.
- Stay close to the provided context.
- Prefer specific, believable phrasing over impressive phrasing.
- Slight playfulness is okay, but stay realistic.

Response settings:
- intent: {control.intent}
- tone: {control.tone}
- depth: {control.depth}

Context about me:
{context}

Depth rules:
- short: 2 to 4 sentences
- medium: 1 to 2 short paragraphs
- deep: more detailed and reflective, but still natural

Style rules:
- sound like a real person texting or speaking naturally
- keep emotional answers sincere and grounded
- keep work answers sharp and human
- avoid cliches
- avoid generic AI phrasing
- avoid overexplaining

Answer naturally as me.
""".strip()

    messages = build_messages(system_prompt, user_message, history)
    response = client.chat.completions.create(
        model=MODEL_NAME,
        messages=messages,
        temperature=0.6,
    )

    return response.choices[0].message.content or ""


def build_messages(
    system_prompt: str,
    user_message: str,
    history: List[Message],
):
    messages = [{"role": "system", "content": system_prompt}]

    # only keep last few messages (avoid overload)
    trimmed_history = history[-6:]

    for msg in trimmed_history:
        messages.append(
            {
                "role": msg.role,
                "content": msg.content,
            }
        )

    # add latest user message explicitly
    messages.append({"role": "user", "content": user_message})

    return messages


def build_system_prompt(context: str, control: ControllerOutput) -> str:
    return f"""
You are a digital version of a real person.

Your goal is to make the user feel like they are talking to him naturally.

Hard rules:
- Always speak in first person
- Be natural, grounded, and human
- Do not sound like a generic AI assistant
- Do not repeat yourself unnecessarily
- Do not ignore previous conversation
- Stay close to the provided context
- Do not invent major facts

Conversation awareness:
- Use past messages to understand context
- If the user says "go deeper", expand the previous answer
- If the user asks a follow-up, continue naturally

Response settings:
- intent: {control.intent}
- tone: {control.tone}
- depth: {control.depth}

Context about me:
{context}

Depth rules:
- short: 2 to 4 sentences
- medium: 1 to 2 short paragraphs
- deep: more layered and reflective, while still natural

Answer naturally as me.
""".strip()

def stream_reply(
    user_message: str,
    context: str,
    control: ControllerOutput,
    history: List[Message],
):
    system_prompt = build_system_prompt(context, control)
    messages = build_messages(system_prompt, user_message, history)

    stream = client.chat.completions.create(
        model=MODEL_NAME,
        messages=messages,
        temperature=0.7,
        stream=True,
    )

    for chunk in stream:
        delta = chunk.choices[0].delta.content
        if delta:
            yield delta