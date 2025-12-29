"use client";

import Stack from "@mui/material/Stack";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";

interface AudioFeatureProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;

  value: number;
  onChange: (value: number) => void;

  label: string;
  lowLabel?: string;
  highLabel?: string;

  min?: number;
  max?: number;
}

export default function AudioFeature({
  enabled,
  onToggle,
  value,
  onChange,
  label,
  lowLabel,
  highLabel,
  min = 0,
  max = 100,
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
        <Typography variant="caption">{lowLabel}</Typography>
        <Slider
          disabled={!enabled}
          value={value}
          onChange={(_, value) => onChange(value as number)}
          valueLabelDisplay="auto"
          min={min}
          max={max}
          sx={{ flexGrow: 1 }}
        />
        <Typography variant="caption">{highLabel}</Typography>
      </Stack>
    </Stack>
  );
}
