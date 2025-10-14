"use client";

import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { fetcher } from "@public-src";
import { useSession, signOut, signIn } from 'next-auth/react';
import { toast } from "react-toastify"
import { useTranslation } from 'react-i18next';

import Head from 'next/head';
import styles from './page.module.css';
import 'react-toastify/dist/ReactToastify.min.css';

import TextField from "@mui/material/TextField"
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link"
import LanguageToogle from './components/LanguageToggle';
import ProviderToggle from './components/ProviderToggle';
import Login from './components/Login';

import { Track, RecommendationSeed, Image, PlaylistUser, Session, Album, Artist, Provider } from './types/types';
import { fetchRecommendations, fetchBaseTrack, createPlaylist, updatePlaylist } from './lib/routes';

interface HomeState {
	seed: string
}

export interface RecommendationResponse {
	tracks: Track[]
	seeds: RecommendationSeed[]
}

export interface CreatePlaylistResponse {
	collaborative: boolean
	description: string | null
	external_urls: {
		spotify: string
	}
	followers: {
		href: string | null
		total: number
	}
	href: string
	id: string
	images: Image[]
	name: string
	owner: PlaylistUser
	public: boolean
	snapshot_id: string
	tracks: {
		href: string
		limit: number
		next: string | null
		offset: number
		previus: string | null
		total: number
		items: {
			added_at: string
			added_by: PlaylistUser
			is_local: boolean
			track: Track // implement episodes?
		}[]
	}
	type: "playlist"
	uri: string
}

interface PlaylistData {
	url: string
	id: string
}

function getUris(recommendationData: RecommendationResponse | null, provider: Provider): string[] {
	if (!recommendationData) return []

	let uris: string[] = []
	if(provider === Provider.SPOTIFY) {
		recommendationData.tracks.forEach(track => {
			uris.push(track.uri)
		});
	} else if (provider === Provider.RECCO) {
		recommendationData.tracks.forEach(track => {
			uris.push(`spotify:track:${getTrackID(track.href)}`)
		})
	}
	return uris
}

function getTrackID(text: string): string {
	if (text.includes('track/')) {
		return text.split('track/')[1].split('?')[0];
	  }
	  
	  if (text.includes('spotify:track:')) {
		return text.split('spotify:track:')[1];
	  }
	  
	  return text;
}

export default function Home(): JSX.Element {
	const {t, i18n} = useTranslation();

	// Authentication
	const {data: session, status} = useSession();
	const [auth, setAuth] = useState<Session | null>(null);

	useEffect(() => {
		if (status === 'loading') {
		  return;
		}
	
		if (session) {
		  // @ts-ignore
		  setAuth(session);
		} else {
		  setAuth(null);
		}
	}, [session, status]);

	// Recommendation
	const [provider, setProvider] = useState<Provider>(Provider.SPOTIFY)
	const [homeState, setHomeState] = useState<HomeState>({seed: ""});
	const [baseTrackData, setBaseTrackData] = useState<Track | null>(null);
	const [recommendationData, setRecommendationData] = useState<RecommendationResponse | null>(null);

	const _fetchRecommendations = async () => {
		if (homeState.seed === "") return; // TODO: can this happen?

		try {
			const data = await fetchRecommendations(homeState.seed, provider, provider === Provider.SPOTIFY ? auth?.token : undefined);
			toast(t("SONG_LOOKUP_SUCESS"), {type:"success"})
			if(provider === Provider.RECCO) data.tracks = data.content // Recco uses "content" instead of "tracks"
			setRecommendationData(data)
		} catch (error) {
			toast(t("SONG_LOOKUP_ERROR"), {type:"error"})
		}
	}
 	

	const _fetchBaseTrack = async () => {
		if (homeState.seed === "") return;

		try {
			const data = await fetchBaseTrack(homeState.seed, auth?.accessToken || "")
			setBaseTrackData(data)
		} catch(error) {
			// TODO: implement errror
		}
	}

	// Playlist
	const [playlistDataState, setPlaylistData] = useState<PlaylistData | null>(null);

	const _createPlaylist = async () => {
		if (!auth) return; // TODO: when does this happen?

		let playlistData = undefined
		try {
			playlistData = await createPlaylist(auth.user.id, auth.accessToken, "Music Discovery Playlist", `Playlist based on "${baseTrackData?.name} by ${baseTrackData?.artists[0].name}"`)
		} catch (error) {
			toast(t("PLAYLIST_CREATE_ERROR"), {type:"error"})
			return
		}

		try {
			await updatePlaylist(playlistData.id, auth.accessToken, getUris(recommendationData, provider))
			toast(t("PLAYLIST_CREATE_SUCCESS"), {type:"success"})
			setPlaylistData({url: playlistData.external_urls.spotify, id: playlistData.id})
		} catch (error) {
			toast(t("PLAYLIST_UPDATE_ERROR"), {type:"error"})
		}
	}

	return (
    	<div className={styles.container}>
    	  <Head>
    	    <title>{t("TITLE")}</title>
    	  </Head>
    	  <main>
			<Stack direction="column" className={styles.container}>
				<Stack direction="row" spacing={1} sx={{ justifyContent: "flex-start", alignItems: "center" }}>
					<LanguageToogle />
					<ProviderToggle setProvider={setProvider} />
				</Stack>
				<Stack direction="row">
					<h1 className={styles.topTitle}>{t("TITLE")}</h1>
				</Stack>
				<Login auth={auth} status={status} />
				{status === "authenticated"
					? <>
						<Stack direction="row" spacing={2} style={{ marginTop:30, width: "100%" }}>
							<TextField fullWidth label={t("TRACK_SEED_LOOKUP")} variant="outlined" onChange={(o) => {const h = homeState; h.seed = getTrackID(o.target.value); setHomeState(h)}}/>
							<Button variant="outlined" onClick={async () => {
								await _fetchRecommendations();
								await _fetchBaseTrack();
								}}>{t("LOOK_UP")}</Button>
						</Stack>
						<Typography component="p" fontSize={13} style={{ marginTop: 8 }}>{t("SEED_EXAMPLE")}</Typography>

						{ recommendationData === null
							? null
							: <Stack direction="column" className={styles.container}>
								<Typography component="p">{
									recommendationData === null
									? t("LOOK_UP_FIRST")
									: recommendationData.tracks.length > 0
										? `${recommendationData.tracks.length} ${t("X_TRACKS_FOUND")}`
										: t("NO_TRACKS_FOUND")
								}</Typography>
								<Button variant="outlined" onClick={_createPlaylist} style={{marginBottom: 20}}>{t("CREATE_PLAYLIST")}</Button>
								{playlistDataState !== null
									? <>
										<Typography component="p">Playlist URL: </Typography>
										<Link href={playlistDataState.url} target="_blank" rel="noopener">{playlistDataState.url}</Link>
									</>
									: null}
							</Stack>}
					</>
					: null}
			</Stack>
    	  </main>
    	</div>
  	);
}
