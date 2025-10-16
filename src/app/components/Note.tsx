"use client";

import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Trans, useTranslation } from "react-i18next";

export default function Note() {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        mt: 3,
        px: 2,
        py: 1.5,
        borderRadius: 2,
        bgcolor: "rgba(0,0,0,0.05)",
        display: "flex",
        alignItems: "flex-start",
        gap: 1.5,
        maxWidth: 650,
      }}
    >
      <InfoOutlinedIcon color="primary" sx={{ mt: "2px" }} />
      <Typography variant="body2">
        <Trans
          i18nKey="NOTE_WEBSITE"
          t={t}
          components={[
            <strong />,

            <Link
              href="https://github.com/Victorsitou/musicdiscover"
              target="_blank"
              rel="noopener noreferrer"
              underline="hover"
              sx={{ cursor: "pointer" }}
            />,
          ]}
        />
      </Typography>
    </Box>
  );
}
