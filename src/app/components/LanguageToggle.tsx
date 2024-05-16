"use client";

import { useTranslation } from 'react-i18next';

import MenuIcon from './MenuIcon';
import Select, { SelectChangeEvent } from "@mui/material/Select"
import FormControl from "@mui/material/FormControl"
import MenuItem from '@mui/material/MenuItem';
import InputLabel from "@mui/material/InputLabel"

import US from "country-flag-icons/react/3x2/US";
import ES from "country-flag-icons/react/3x2/ES";

import styles from "./LanguageToggle.module.css"

export default function LanguageToogle() {
    const { t, i18n } = useTranslation();

    const handleChange = (event: SelectChangeEvent) => {
        i18n.changeLanguage(event.target.value)
    }

    return (
        <div  className={styles.languageToggleContainer}>
            <FormControl>
                <InputLabel shrink htmlFor="uncontrolled-native">{t("SELECT_LANGUAGE")}</InputLabel>
                <Select
                    defaultValue="en"
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
