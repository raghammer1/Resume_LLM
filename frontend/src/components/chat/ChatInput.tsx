import type { FormEvent } from "react";
import { Button, Stack, TextField } from "@mui/material";

type ChatInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
};

export default function ChatInput({
  value,
  onChange,
  onSubmit,
  disabled = false,
}: ChatInputProps) {
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onSubmit();
  }

  return (
    <Stack component="form" direction="row" spacing={1.5} onSubmit={handleSubmit}>
      <TextField
        fullWidth
        placeholder="Ask me anything..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        variant="outlined"
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "18px",
            backgroundColor: "rgba(255,255,255,0.04)",
          },
        }}
      />
      <Button
        type="submit"
        disabled={disabled || value.trim().length === 0}
        variant="contained"
        sx={{
          minWidth: 96,
          px: 3,
          backgroundColor: "#f5f7fb",
          color: "#111",
          "&:hover": {
            backgroundColor: "#e8ebf2",
          },
        }}
      >
        Send
      </Button>
    </Stack>
  );
}