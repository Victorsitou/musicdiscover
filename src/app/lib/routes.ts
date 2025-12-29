import { fetcher } from "@public-src";
import useSWR from "swr";
import { Provider, Track, AudioFeaturesOptions } from "../types/types";

export async function fetchRecommendations(
  seed: string,
  provider: Provider,
  token?: string,
  options?: AudioFeaturesOptions
) {
  let url = "";

  if (provider === Provider.SPOTIFY) {
    let queryParams = "";
    if (options) {
      if (typeof options.target_energy === "number")
        queryParams += `&target_energy=${options.target_energy}`;
      if (typeof options.target_valence === "number")
        queryParams += `&target_valence=${options.target_valence}`;
      if (typeof options.target_danceability === "number")
        queryParams += `&target_danceability=${options.target_danceability}`;
      if (typeof options.target_popularity === "number")
        queryParams += `&target_popularity=${options.target_popularity}`;
      if (typeof options.max_speechiness === "number")
        queryParams += `&max_speechiness=${options.max_speechiness}`;
      if (typeof options.min_duration_ms === "number")
        queryParams += `&min_duration_ms=${options.min_duration_ms}`;
    }
    url = `https://api.spotify.com/v1/recommendations?limit=100&seed_tracks=${seed}${queryParams}`;
  } else {
    let queryParams = "";
    if (options) {
      if (typeof options.target_energy === "number")
        queryParams += `&energy=${options.target_energy}`;
      if (typeof options.target_valence === "number")
        queryParams += `&valence=${options.target_valence}`;
      if (typeof options.target_danceability === "number")
        queryParams += `&danceability=${options.target_danceability}`;
      if (typeof options.target_popularity === "number")
        queryParams += `&popularity=${options.target_popularity}`;
      if (typeof options.max_speechiness === "number")
        queryParams += `&speechiness=${options.max_speechiness}`;
    }
    url = `https://api.reccobeats.com/v1/track/recommendation?size=100&seeds=${seed}${queryParams}`;
  }
  const data = fetch(
    url,
    token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
  ).then((res) => res.json());
  return data;
}

export function fetchBaseTrack(seed: string, token: string) {
  const data = fetch(`https://api.spotify.com/v1/tracks/${seed}`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then((res) => res.json());
  return data;
}

export async function createPlaylist(
  userId: string,
  token: string,
  name: string,
  description: string
) {
  const data = fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: name,
      description: description,
    }),
  }).then((res) => res.json());
  return data;
}

export async function updatePlaylist(
  playlistId: string,
  token: string,
  uris: string[]
) {
  const data = fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        uris: uris,
      }),
    }
  ).then((res) => res.json);
  return data;
}
