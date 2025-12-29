"use client";

import Stack from "@mui/material/Stack";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";

interface AudioFeatureProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;

  value: number;
  onChange: (value: number) => void;

  label: string;
}

export default function AudioFeatureText({
  enabled,
  onToggle,
  value,
  onChange,
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

      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        sx={{ flexGrow: 1 }}
      >
        <TextField
          disabled={!enabled}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          type="number"
          variant="outlined"
          size="small"
          sx={{ flexGrow: 1 }}
        />
      </Stack>
    </Stack>
  );
}
