import { Chip, Stack } from "@mui/material";
import { STARTER_PROMPTS } from "../../utils/constants";

type StarterPromptsProps = {
  onSelectPrompt: (prompt: string) => void;
  disabled?: boolean;
};

export default function StarterPrompts({
  onSelectPrompt,
  disabled = false,
}: StarterPromptsProps) {
  return (
    <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>
      {STARTER_PROMPTS.map((prompt) => (
        <Chip
          key={prompt}
          label={prompt}
          onClick={() => onSelectPrompt(prompt)}
          disabled={disabled}
          variant="outlined"
          sx={{
            color: "text.primary",
            borderColor: "rgba(255,255,255,0.12)",
            backgroundColor: "rgba(255,255,255,0.03)",
            "&:hover": {
              backgroundColor: "rgba(255,255,255,0.07)",
            },
          }}
        />
      ))}
    </Stack>
  );
}