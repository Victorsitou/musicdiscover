"use client";

import { useTranslation } from 'react-i18next';

import MenuIcon from './MenuIcon';
import Select from "@mui/material/Select"
import FormControl from "@mui/material/FormControl"
import MenuItem from '@mui/material/MenuItem';
import InputLabel from "@mui/material/InputLabel"

import US from "country-flag-icons/react/3x2/US";
import ES from "country-flag-icons/react/3x2/ES";

import { Provider } from '../types/types';

export default function ProviderToggle({setProvider}: {setProvider: (provider: Provider) => void}) {
	const { t, i18n } = useTranslation();

	return (
		<div>
			<FormControl>
				<InputLabel shrink htmlFor="uncontrolled-native">{t("SELECT_PROVIDER")}</InputLabel>
				<Select
					defaultValue="spotify"
					onChange={(e) => setProvider(e.target.value as Provider)}
					autoWidth
					label={t("SELECT_PROVIDER")}
				>
					<MenuItem value={Provider.SPOTIFY}><MenuIcon text="Spotify" icon={<US />}/></MenuItem>
					<MenuItem value={Provider.RECCO}><MenuIcon text="Recco" icon={<ES />}/></MenuItem>
				</Select>
			</FormControl>
		</div>
	);
}
