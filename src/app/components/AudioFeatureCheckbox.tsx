"use client";

import Stack from "@mui/material/Stack";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

interface AudioFeatureProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;

  label: string;
}

export default function AudioFeature({
  enabled,
  onToggle,
  label,
}: AudioFeatureProps) {
  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <FormControlLabel
        control={
          <Checkbox
            checked={enabled}
            onChange={(e) => onToggle(e.target.checked)}
          />
        }
        label={label}
        sx={{ width: 250 }}
      />
    </Stack>
  );
}
