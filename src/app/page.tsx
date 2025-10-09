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
import Login from './components/Login';

import { Track, RecommendationSeed, Image, PlaylistUser, Session, Album, Artist } from './types/types';

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
	const [homeState, setHomeState] = useState<HomeState>({seed: ""});
	const [baseTrackData, setBaseTrackData] = useState<Track | null>(null);
	const [shouldFetchBaseTrack, setShouldFetchBaseTrack] = useState<boolean>(false);
	const [recommendationData, setRecommendationData] = useState<RecommendationResponse | null>(null);
	const [shouldFetchRecommendation, setShouldFetchRecommendation] = useState<boolean>(false);
	const {data, error, isLoading} = useSWR<RecommendationResponse, Error>(
		shouldFetchRecommendation 
			? [`https://api.spotify.com/v1/recommendations?limit=100&seed_tracks=${homeState.seed}`, {
				method: "GET",
				headers: { // no cache
					"Authorization": `{'Authorization': 'Bearer ${auth?.token}'}`
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
		setShouldFetchRecommendation(false);
	}

	const {data: APIBaseTrackData, error: APIBaseTrackError, isLoading: APIBaseTrackIsLoading} = useSWR<Track, Error>(
		shouldFetchBaseTrack
			? [`https://api.spotify.com/v1/tracks/${homeState.seed}`, {
				method: "GET",
				headers: { // no cache
					"Authorization": `{'Authorization': 'Bearer ${auth?.accessToken}'}`
				}
			}]
			: null,
			([url, options]: [string, RequestInit]) => fetcher(url, options)
	)

	if (APIBaseTrackData) {
		setBaseTrackData(APIBaseTrackData);
		setShouldFetchBaseTrack(false);
	}

	// Playlist
	const [createPlaylist, setCreatePlaylist] = useState<boolean>(false);
	const [updatePlaylist, setUpdatePlaylist] = useState<boolean>(false);
	const [playlistDataState, setPlaylistData] = useState<PlaylistData | null>(null);

	const {data: playlistData, error: playlistError, isLoading: playlistIsLoading} = useSWR<CreatePlaylistResponse, Error>(
			createPlaylist 
				? [`https://api.spotify.com/v1/users/${auth?.user.id}/playlists`, {
					method: "POST",
					headers: { // no cache
						"Authorization": `{'Authorization': 'Bearer ${auth?.accessToken}'}`
					},
					body: JSON.stringify({
						name: "Music Discovery Playlist",
						description: `Playlist based on "${baseTrackData?.name}" by "${baseTrackData?.artists[0].name}"`
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
					"Authorization": `{'Authorization': 'Bearer ${auth?.accessToken}'}`
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
				<LanguageToogle />
				<Stack direction="row">
					<h1 className={styles.topTitle}>{t("TITLE")}</h1>
				</Stack>
				<Login auth={auth} status={status} />
				{status === "authenticated"
					? <>
						<Stack direction="row" spacing={2} style={{ marginTop:30, width: "100%" }}>
							<TextField fullWidth label={t("TRACK_SEED_LOOKUP")} variant="outlined" onChange={(o) => {const h = homeState; h.seed = getTrackID(o.target.value); setHomeState(h)}}/>
							<Button variant="outlined" onClick={() => {setShouldFetchRecommendation(true); setShouldFetchBaseTrack(true)}}>{t("LOOK_UP")}</Button>
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
								<Button variant="outlined" onClick={() => {setCreatePlaylist(true)}} style={{marginBottom: 20}}>{t("CREATE_PLAYLIST")}</Button>
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
