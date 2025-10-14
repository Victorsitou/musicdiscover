export interface RecommendationSeed {
	afterFilteringSize: number
	afterRelinkingSize: number
	href: string
	id: string
	initialPoolSize: number
	type: "artist" | "track" | "genre"
}

export interface Image {
	url: string
	height: number
	width: number
}

export interface SimplifiedArtist {
	external_urls: {
		spotify: string
	}
	href: string
	id: string
	name: string
	type: string
	uri: string
}

export interface Artist extends SimplifiedArtist {
	followers: {
		href: string | null
		total: number
	}
	genres: string[]
	images: Image[]
	popularity: number
}

export interface Album {
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

export interface Track {
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

export interface PlaylistUser {
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

export interface Session {
	accessToken: string
	expires: string
	user: {
		id: string
		name: string
		image: string
		email: string
	}
	token: string
}

export enum Provider {
	SPOTIFY = "spotify",
	RECCO = "recco"
}