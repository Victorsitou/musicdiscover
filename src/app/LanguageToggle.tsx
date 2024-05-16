import { useTranslation } from 'react-i18next';

import Select, { SelectChangeEvent } from "@mui/material/Select"
import FormControl from "@mui/material/FormControl"
import FormHelperText from '@mui/material/FormHelperText';
import MenuItem from '@mui/material/MenuItem';

export default function LanguageToogle() {
    const { t, i18n } = useTranslation();

    const handleChange = (event: SelectChangeEvent) => {
        i18n.changeLanguage(event.target.value)
    }

    return (
        <FormControl>
            <Select
                defaultValue="en"
                label={t("SELECT_LANGUAGE")}
                onChange={handleChange}
                autoWidth
            >
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="es">Español</MenuItem>
            </Select>
            <FormHelperText>{t("SELECT_LANGUAGE")}</FormHelperText>
        </FormControl>
    );
}
