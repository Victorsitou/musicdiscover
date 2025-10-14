import { fetcher } from "@public-src";
import useSWR from "swr";
import { Provider, Track } from "../types/types";

export async function fetchRecommendations(
  seed: string,
  provider: Provider,
  token?: string
) {
  let url = "";
  if (provider === Provider.SPOTIFY) {
    url = `https://api.spotify.com/v1/recommendations?limit=100&seed_tracks=${seed}`;
  } else {
    url = `https://api.reccobeats.com/v1/track/recommendation?size=100&seeds=${seed}`;
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
