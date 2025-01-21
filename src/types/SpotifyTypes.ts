export interface RecentlyPlayedResponse {
  items: TrackItem[];
}

export interface TrackItem {
  track: Track;
  played_at: string;
}

export interface Track {
  name: string;
  artists: Artist[];
  album: Album;
  external_urls: ExternalUrls
}

export interface Artist {
  name: string;
}

export interface Album {
  images: Array<{ url: string }>;
}

export interface ExternalUrls {
  spotify: string;
}

export interface TrackDisplay {
  name: string;
  artist: string;
  albumArt: string;
  playedAt: string;
  url: string;
}
