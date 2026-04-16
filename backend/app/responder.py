import os
from typing import List

from dotenv import load_dotenv
from openai import OpenAI

from app.models import ControllerOutput, Message

load_dotenv()

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY", "ollama"),
    base_url=os.getenv("OPENAI_BASE_URL", "http://localhost:11434/v1"),
)

MODEL_NAME = os.getenv("OLLAMA_MODEL", "llama3")

BAD_PHRASES = [
    "hopeless romantic",
    "just ask anyone",
    "i thrive at",
    "my loved ones would say",
]


def looks_generic(reply: str) -> bool:
    lowered = reply.lower()
    return any(phrase in lowered for phrase in BAD_PHRASES)


def build_system_prompt(context: str, control: ControllerOutput) -> str:
    return f"""
You are a digital version of a real person.

Your goal is to make the user feel like they are talking to him naturally.

Hard rules:
- Always speak in first person
- Be natural, grounded, warm, and self-aware
- Do not sound like a generic AI assistant
- Do not sound like a therapist, coach, marketer, or corporate bio
- Do not use cheesy, overdramatic, overpoetic, or exaggerated phrasing
- Do not invent major facts or fake stories
- Stay close to the provided context
- Use previous conversation naturally
- Do not repeat yourself unnecessarily

Voice behavior:
- Use style examples to match phrasing and rhythm
- Use beliefs to shape worldview
- Use stories only when relevant and subtly
- Follow the voice rules closely
- Avoid anything listed under anti-examples
- Prefer believable phrasing over impressive phrasing

Voice imitation rules:
- Strongly match the phrasing style of the style examples
- Match sentence structure, tone, and rhythm
- Do not default to generic AI phrasing even if it sounds correct
- If unsure, lean toward simpler, more natural phrasing like the examples

Conversation awareness:
- If the user says "go deeper", expand naturally
- If the user asks a follow-up, continue naturally from earlier context

Response settings:
- intent: {control.intent}
- tone: {control.tone}
- depth: {control.depth}

Context about me:
{context}

Depth rules:
- short: 2 to 4 sentences, crisp and natural
- medium: 1 to 2 short paragraphs
- deep: more layered, reflective, and detailed, while still conversational

Answer naturally as me.
""".strip()


def build_messages(
    system_prompt: str,
    history: List[Message],
):
    messages = [{"role": "system", "content": system_prompt}]

    # Keep only the last few turns to avoid overload
    trimmed_history = history[-6:]

    for msg in trimmed_history:
        messages.append(
            {
                "role": msg.role,
                "content": msg.content,
            }
        )

    return messages


def generate_reply(
    user_message: str,
    context: str,
    control: ControllerOutput,
    history: List[Message],
) -> str:
    system_prompt = build_system_prompt(context, control)
    messages = build_messages(system_prompt, history)

    response = client.chat.completions.create(
        model=MODEL_NAME,
        messages=messages,
        temperature=0.6,
    )

    reply = response.choices[0].message.content or ""

    if looks_generic(reply):
        retry_messages = messages + [
            {
                "role": "system",
                "content": (
                    "Rewrite the answer to sound more grounded, natural, and specific. "
                    "Avoid cheesy, dramatic, generic, or AI-sounding phrasing."
                ),
            }
        ]

        retry_response = client.chat.completions.create(
            model=MODEL_NAME,
            messages=retry_messages,
            temperature=0.5,
        )
        reply = retry_response.choices[0].message.content or reply

    return reply


def stream_reply(
    user_message: str,
    context: str,
    control: ControllerOutput,
    history: List[Message],
):
    system_prompt = build_system_prompt(context, control)
    messages = build_messages(system_prompt, history)

    stream = client.chat.completions.create(
        model=MODEL_NAME,
        messages=messages,
        temperature=0.6,
        stream=True,
    )

    for chunk in stream:
        delta = chunk.choices[0].delta.content
        if delta:
            yield delta