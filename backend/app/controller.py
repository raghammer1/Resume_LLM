import os
import json
from dotenv import load_dotenv
from openai import OpenAI

from app.models import ControllerOutput

load_dotenv()

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY", "ollama"),
    base_url=os.getenv("OPENAI_BASE_URL", "http://localhost:11434/v1"),
)

MODEL_NAME = os.getenv("OLLAMA_MODEL", "llama3")

ALLOWED_INTENTS = {"about_me","career", "hobbies", "values", "personal", "playful", "general", "love"}
ALLOWED_TONES = {"professional", "casual", "reflective", "playful"}
ALLOWED_DEPTHS = {"short", "medium", "deep"}


def classify_message(user_message: str) -> ControllerOutput:
    system_prompt = """
You are a strict message classifier.

Classify the user's message into exactly one of these intents:
- about_me
- career
- hobbies
- values
- personal
- playful
- general
- love

Also decide:
- tone: "professional" if intent is career, otherwise usually "casual"
- depth: one of "short", "medium", or "deep"
- context_needed: an array of one or more highly relevant context buckets needed to answer the message well

Rules:
- Allowed context_needed values are only:
  ["about_me","career", "hobbies", "values", "personal", "playful", "general", "love"]
- context_needed may contain multiple values
- every value must be highly relevant
- the first value should usually be the main intent

Depth rules:
- Use "short" for simple, direct, casual, or introductory questions
- Use "medium" for normal conversational questions that need some explanation or personality
- Use "deep" for emotional, reflective, philosophical, vulnerable, or high-stakes questions
- Questions about love, values, identity, or emotional patterns should often be "medium" or "deep"
- Quick questions like "what do you do?" or "what are your hobbies?" should usually be "short"

Return ONLY valid JSON.
Do not include markdown, backticks, or explanation.

Example:
{
  "intent": "love",
  "tone": "casual",
  "depth": "deep",
  "context_needed": ["love", "personal", "values"]
}
""".strip()

    try:
        response = client.chat.completions.create(
            model=MODEL_NAME,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message},
            ],
            temperature=0,
            response_format={"type": "json_object"},
        )

        raw = response.choices[0].message.content or ""
        print("RAW CONTROLLER OUTPUT:", repr(raw))

        data = json.loads(raw)

        intent = data.get("intent", "general")
        tone = data.get("tone", "casual")
        depth = data.get("depth", "medium")
        context_needed = data.get("context_needed", [])

        if intent not in ALLOWED_INTENTS:
            intent = "general"

        if tone not in ALLOWED_TONES:
            tone = "professional" if intent == "career" else "casual"

        if depth not in ALLOWED_DEPTHS:
            depth = "medium"

        if not isinstance(context_needed, list):
            context_needed = []

        context_needed = [x for x in context_needed if x in ALLOWED_INTENTS]
        context_needed = list(dict.fromkeys(context_needed))

        if not context_needed:
            context_needed = [intent]

        if intent not in context_needed:
            context_needed = [intent] + context_needed

        output = ControllerOutput(
            intent=intent,
            tone=tone,
            depth=depth,
            context_needed=context_needed,
        )

        print("CLEAN CONTROLLER OUTPUT:", output.model_dump())
        return output

    except Exception as e:
        print(f"Failed to parse controller output, defaulting to general intent. Error: {e}")
        return ControllerOutput(
            intent="general",
            tone="casual",
            depth="medium",
            context_needed=["general"],
        )