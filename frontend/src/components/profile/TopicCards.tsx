import { Paper, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { TOPIC_CARDS } from "../../utils/constants";

const Grid = styled("div")(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: theme.spacing(2),
  marginTop: theme.spacing(2.5),
  [theme.breakpoints.up("md")]: {
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  },
}));

const Card = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2.5),
  borderRadius: 24,
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.04)",
  cursor: "pointer",
  transition: "transform 160ms ease, border-color 160ms ease, background 160ms ease",
  "&:hover": {
    transform: "translateY(-2px)",
    borderColor: "rgba(158,197,255,0.26)",
    background: "rgba(255,255,255,0.06)",
  },
}));

type TopicCardsProps = {
  onSelectPrompt: (prompt: string) => void;
};

export default function TopicCards({ onSelectPrompt }: TopicCardsProps) {
  return (
    <Stack spacing={1.5} sx={{ mt: 2.5 }}>
      <Typography variant="h5" sx={{ fontWeight: 650 }}>
        Explore through topics
      </Typography>
      <Typography variant="body2" sx={{ color: "text.secondary", maxWidth: 760 }}>
        Instead of guessing what to ask, start anywhere. Each topic opens up a
        different side of me.
      </Typography>

      <Grid>
        {TOPIC_CARDS.map((topic) => (
          <Card key={topic.title} elevation={0} onClick={() => onSelectPrompt(topic.prompt)}>
            <Stack spacing={1.25}>
              <Typography variant="h6" sx={{ fontWeight: 650 }}>
                {topic.title}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {topic.description}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "primary.main", fontWeight: 600, pt: 0.5 }}
              >
                {topic.prompt}
              </Typography>
            </Stack>
          </Card>
        ))}
      </Grid>
    </Stack>
  );
}