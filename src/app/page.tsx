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
import ThemeToggle from './ThemeToggler';
import LanguageToogle from './LanguageToggle';

interface HomeState {
	seed: string
}

interface RecommendationSeed {
	afterFilteringSize: number
	afterRelinkingSize: number
	href: string
	id: string
	initialPoolSize: number
	type: "artist" | "track" | "genre"
}

interface Image {
	url: string
	height: number
	width: number
}

interface SimplifiedArtist {
	external_urls: {
		spotify: string
	}
	href: string
	id: string
	name: string
	type: string
	uri: string
}

interface Artist extends SimplifiedArtist {
	followers: {
		href: string | null
		total: number
	}
	genres: string[]
	images: Image[]
	popularity: number
}

interface Album {
	album_type: string
	total_tracks: number
	available_markets: string[]
	external_urls: {
		spotify: string
	}
	href: string
	id: string
	images: Image[]
	name: string
	release_date: string
	release_date_precision: string
	restrictions: {
		reason: "market" | "product" | "explicit"
	}
	type: string
	uri: string
	artists: SimplifiedArtist[]
}

interface Track {
	album: Album
	artists: Artist[]
	available_markets: string[]
	disc_number: number
	duration_ms: number
	explicit: boolean
	external_ids: {
		isrc: string
		ean: string
		upc: string
	}
	external_urls: {
		spotify: string
	}
	href: string
	id: string
	is_playable: boolean
	linked_from: object // What is this?
	restrictions: {
		reason: "market" | "product" | "explicit"
	}
	name: string
	popularity: number
	preview_url: string | null
	track_number: number
	type: "track"
	uri: string
	is_local: boolean
}

interface PlaylistUser {
	external_urls: {
		spotify: string
	}
	followers: {
		href: string | null
		total: number
	}
	href: string
	id: string
	type: "user"
	uri: string
	display_name: string | null
}

interface RecommendationResponse {
	tracks: Track[]
	seeds: RecommendationSeed[]
}

interface CreatePlaylistResponse {
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

interface Session {
	accessToken: string
	expires: string
	user: {
		id: string
		name: string
		image: string
		email: string
	}
}

interface PlaylistData {
	url: string
	id: string
}

function getUris(recommendationData: RecommendationResponse | null): string[] {
	if (!recommendationData) return []
	const uris: string[] = []
	recommendationData.tracks.forEach(track => {
		uris.push(track.uri)
	});
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
	const { t, i18n } = useTranslation();
	const { data: session, status } = useSession();
	const [auth, setAuth] = useState<Session | null>(null);

	// Playlist
	const [createPlaylist, setCreatePlaylist] = useState<boolean>(false);
	const [updatePlaylist, setUpdatePlaylist] = useState<boolean>(false);
	const [playlistDataState, setPlaylistData] = useState<PlaylistData | null>(null);

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

	const [recommendationData, setRecommendationData] = useState<RecommendationResponse | null>(null);
	const [homeState, setHomeState] = useState<HomeState>({
		seed: ""
	});
	const [shouldFetch, setShouldFetch] = useState<boolean>(false);
	const {data, error, isLoading} = useSWR<RecommendationResponse, Error>(
		shouldFetch 
			? [`https://api.spotify.com/v1/recommendations?limit=100&seed_tracks=${homeState.seed}`, {
				method: "GET",
				headers: { // no cache
					"Authorization": `Bearer ${auth?.accessToken}`
				}
			}]
			: null,
			([url, options]: [string, RequestInit]) => fetcher(url, options)
	);

	if (data) {
		if ("error" in data){
			toast(t("SONG_LOOKUP_ERROR"), { type: "error" })
		} else {
			toast(t("SONG_LOOKUP_SUCESS"), { type: "success" })
			setRecommendationData(data);
		}
		setShouldFetch(false);
	}


	const {data: playlistData, error: playlistError, isLoading: playlistIsLoading} = useSWR<CreatePlaylistResponse, Error>(
			createPlaylist 
				? [`https://api.spotify.com/v1/users/${auth?.user.id}/playlists`, {
					method: "POST",
					headers: { // no cache
						"Authorization": `Bearer ${auth?.accessToken}`
					},
					body: JSON.stringify({
						name: "Music Discovery Playlist"
					})
				}]
				: null,
				([url, options]: [string, RequestInit]) => fetcher(url, options)
	);


	if (playlistData) {
		if ("error" in playlistData) {
			toast(t("PLAYLIST_CREATE_ERROR"), { type: "error" })
		} else {
			setPlaylistData({id: playlistData.id, url: playlistData.external_urls.spotify})
			setUpdatePlaylist(true);
		}
		setCreatePlaylist(false);
	}

	const {data: updatePlaylistData, error: updatePlaylistError, isLoading: updatePlaylistIsLoagins} = useSWR(
		updatePlaylist && playlistDataState?.id !== ""
			? [`https://api.spotify.com/v1/playlists/${playlistDataState?.id}/tracks`, {
				method: "POST",
				headers: { // no cache
					"Authorization": `Bearer ${auth?.accessToken}`
				},
				body: JSON.stringify({
					uris: getUris(recommendationData)
				})
			}]
			: null,
			([url, options]: [string, RequestInit]) => fetcher(url, options)
	);
	
	if (updatePlaylistData){
		if ("error" in updatePlaylistData) {
			toast(t("PLAYLIST_UPDATE_ERROR"), { type: "error" })
		} else {
			toast(t("PLAYLIST_CREATE_SUCCESS"), { type: "success" })
		}
		setUpdatePlaylist(false);
	}

	return (
    	<div className={styles.container}>
    	  <Head>
    	    <title>{t("TITLE")}</title>
    	  </Head>
    	  <main>
			<Stack direction="column" className={styles.container}>
				<Stack direction="row">
					<h1 className={styles.topTitle}>{t("TITLE")}</h1>
				</Stack>
				<LanguageToogle />
				<Typography style={{ marginTop: 10 }}>{auth !== null ? `${t("LOGGED_IN")} ${auth.user.name}` : t("NOT_LOGGED_IN")}</Typography>
				{status === "authenticated" 
				? <Button variant="outlined" onClick={() => {signOut()}}>{t("LOG_OUT")}</Button> 
				: <Button variant="outlined" onClick={() => {signIn()}}>{t("LOG_IN")}</Button>}
				<Stack direction="row" spacing={2} style={{ marginTop:30 }}>
					<TextField label={t("TRACK_SEED_LOOKUP")} variant="outlined" onChange={(o) => {const h = homeState; h.seed = getTrackID(o.target.value); setHomeState(h)}}/>
					<Button variant="outlined" onClick={() => {setShouldFetch(true)}}>{t("LOOK_UP")}</Button>
				</Stack>
				<Typography component="p" fontSize={13} style={{ marginTop: 8 }}>{t("SEED_EXAMPLE")}</Typography>
			</Stack>
    	    
			<Stack direction="column" className={styles.container}>
				<Typography component="p">{
					recommendationData === null
					? t("LOOK_UP_FIRST")
					: recommendationData.tracks.length > 0
						? `${recommendationData.tracks.length} ${t("X_TRACKS_FOUND")}`
						: t("NO_TRACKS_FOUND")
				}</Typography>
				<Button variant="outlined" onClick={() => {setCreatePlaylist(true)}} style={{marginBottom: 20}}>{t("CREATE_PLAYLIST")}</Button>
				{playlistDataState !== null
					? <>
						<Typography component="p">Playlist URL: </Typography>
						<Link href={playlistDataState.url} target="_blank" rel="noopener">{playlistDataState.url}</Link>
					</>
					: null}
			</Stack>
    	  </main>
    	</div>
  	);
}
