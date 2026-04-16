from app.data.profile import PROFILE_DATA


def retrieve_context(context_needed: list[str]) -> str:
    sections = []

    for i, key in enumerate(context_needed):
        bucket = PROFILE_DATA.get(key)
        if not bucket:
            continue

        summary = bucket.get("summary", "").strip()
        traits = bucket.get("traits", [])
        beliefs = bucket.get("beliefs", [])
        style_examples = bucket.get("style_examples", [])
        stories = bucket.get("stories", [])

        block = f"## {key.upper()}\n"

        # main bucket gets slightly richer retrieval
        if summary:
            block += f"Summary:\n{summary}\n\n"

        if traits:
            block += "Traits:\n"
            block += ", ".join(traits[:5]) + "\n\n"

        if beliefs:
            block += "Beliefs:\n"
            for belief in beliefs[:3 if i == 0 else 2]:
                block += f"- {belief}\n"
            block += "\n"

        if style_examples:
            block += "Style examples:\n"
            for ex in style_examples[:3 if i == 0 else 2]:
                block += f'- {ex}\n'
            block += "\n"

        if stories:
            block += "Stories:\n"
            for story in stories[:2 if i == 0 else 1]:
                block += f"- {story}\n"

        sections.append(block.strip())

    return "\n\n".join(sections).strip()