"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        mt: 6,
        py: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 0.5,
        fontSize: 14,
        opacity: 0.8,
      }}
    >
      <Typography variant="body2">
        Creado por{" "}
        <strong>
          <Link
            href="https://github.com/Victorsitou"
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
          >
            Victor
          </Link>
        </strong>
      </Typography>

      <Typography variant="body2">
        Código abierto en{" "}
        <Link
          href="https://github.com/Victorsitou/musicdiscover"
          target="_blank"
          rel="noopener noreferrer"
          underline="hover"
          //color="inherit"
          sx={{ fontWeight: 500 }}
        >
          GitHub
        </Link>
      </Typography>
    </Box>
  );
}
