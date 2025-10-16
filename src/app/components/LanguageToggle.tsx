"use client";

import { useTranslation } from 'react-i18next';

import MenuIcon from './MenuIcon';
import Select, { SelectChangeEvent } from "@mui/material/Select"
import FormControl from "@mui/material/FormControl"
import MenuItem from '@mui/material/MenuItem';
import InputLabel from "@mui/material/InputLabel"

import US from "country-flag-icons/react/3x2/US";
import ES from "country-flag-icons/react/3x2/ES";

import { setLangPref } from '../lib/prefs';

export default function LanguageToogle() {
    const { t, i18n } = useTranslation();

    const handleChange = (event: SelectChangeEvent) => {
        i18n.changeLanguage(event.target.value)
        setLangPref(event.target.value as "en" | "es")
    }

    return (
        <div>
            <FormControl>
                <InputLabel shrink htmlFor="uncontrolled-native">{t("SELECT_LANGUAGE")}</InputLabel>
                <Select
                    defaultValue={i18n.language}
                    onChange={handleChange}
                    autoWidth
                    label={t("SELECT_LANGUAGE")}
                >
                    <MenuItem value="en"><MenuIcon text="English" icon={<US />}/></MenuItem>
                    <MenuItem value="es"><MenuIcon text="Español" icon={<ES />}/></MenuItem>
                </Select>
            </FormControl>
        </div>
    );
}
