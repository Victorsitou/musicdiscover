import { useTranslation } from 'react-i18next';
import { signOut, signIn } from 'next-auth/react';

import { Session } from "next-auth"

import { createTheme, PaletteColorOptions, ThemeProvider } from '@mui/material/styles';
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"

declare module '@mui/material/styles' {
    interface CustomPalette {
      spotify: PaletteColorOptions;
    }
    interface Palette extends CustomPalette {}
    interface PaletteOptions extends CustomPalette {}
  }
  
declare module '@mui/material/Button' {
    interface ButtonPropsColorOverrides {
      spotify: true;
    }
}

const { palette } = createTheme();
const { augmentColor } = palette;
const createColor = (mainColor) => augmentColor({ color: { main: mainColor } });

const theme = createTheme({
  palette: {
    spotify: createColor('#1db954'),
  },
  typography: {
    button: {
        fontSize: 13,
        fontWeight: 700
    }
  }
});

interface LoginProps {
    auth: Session | null
    status: string
}

export default function Login(props: LoginProps) {
    const {t, i18n} = useTranslation();

    return (
        <ThemeProvider theme={theme}>
            <Typography style={{ marginTop: 10, marginBottom: 15, wordWrap: "break-word" }} textAlign="center">{props.auth !== null ? `${t("LOGGED_IN")} ${props.auth.user?.name}` : t("NOT_LOGGED_IN")}</Typography>
            {props.status === "authenticated" 
                ? <Button color="spotify" variant="contained" onClick={() => {signOut()}}>{t("LOG_OUT")}</Button> 
                : <Button color="spotify" variant="contained" onClick={() => {signIn()}}>{t("LOG_IN")}</Button>
            }
        </ThemeProvider>
    )
}