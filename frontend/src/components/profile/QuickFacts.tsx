import { Chip, Paper, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { QUICK_FACTS } from "../../utils/constants";

const Card = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2.5),
  borderRadius: 24,
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.04)",
}));

export default function QuickFacts() {
  return (
    <Card elevation={0}>
      <Stack spacing={1.5}>
        <Typography variant="h6" sx={{ fontWeight: 650 }}>
          Quick read
        </Typography>
        <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>
          {QUICK_FACTS.map((fact) => (
            <Chip
              key={fact}
              label={fact}
              variant="outlined"
              sx={{
                borderColor: "rgba(255,255,255,0.12)",
                color: "text.primary",
                backgroundColor: "rgba(255,255,255,0.03)",
              }}
            />
          ))}
        </Stack>
      </Stack>
    </Card>
  );
}