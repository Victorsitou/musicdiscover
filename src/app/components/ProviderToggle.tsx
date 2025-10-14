"use client";

import { useTranslation } from 'react-i18next';

import MenuIcon from './MenuIcon';
import Select from "@mui/material/Select"
import FormControl from "@mui/material/FormControl"
import MenuItem from '@mui/material/MenuItem';
import InputLabel from "@mui/material/InputLabel"
import Box from "@mui/material/Box"

import ReccoPNG from "@public/recco.png"
import SpotifyPNG from "@public/spotify.png"
import Image from "next/image"

import { Provider } from '../types/types';
import { setProviderPref } from '../lib/prefs';

export default function ProviderToggle({defaultProvider, setProvider}: {defaultProvider: Provider, setProvider: (provider: Provider) => void}) {
	const { t } = useTranslation();

	const handleChange = (event: any) => {
		setProviderPref(event.target.value as Provider)
	}

	return (
		<div>
			<FormControl sx={{minWidth: 160 }}>
				<InputLabel shrink htmlFor="uncontrolled-native">{t("SELECT_PROVIDER")}</InputLabel>
				<Select
					defaultValue={defaultProvider}
					onChange={(e) => handleChange(e)}
					autoWidth
					label={t("SELECT_PROVIDER")}
				>
					<MenuItem value={Provider.SPOTIFY}>
						<Box sx={{ display: "flex", alignItems: "center", gap: 1}}>
							<Image src={SpotifyPNG} alt="Spotify" width={18} height={18} />
							<span>Spotify</span>
						</Box>
					</MenuItem>
					<MenuItem value={Provider.RECCO}>
						<Box sx={{ display: "flex", alignItems: "center", gap: 1}}>
							<Image src={ReccoPNG} alt="Recco" width={18} height={18} />
							<span>Recco</span>
						</Box>
					</MenuItem>
				</Select>
			</FormControl>
		</div>
	);
}
