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
}

export interface Artist {
  name: string;
}

export interface Album {
  images: { url: string }[];
}
