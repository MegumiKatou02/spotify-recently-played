import { ref } from 'vue';
import { SpotifyService } from '@/services/SpotifyService';
import type { TrackItem, TrackDisplay } from '@/types/SpotifyTypes';


export function useSpotify() {
  const tracks = ref<TrackDisplay[]>([]);

  const fetchRecentlyPlayed = async (user: string | undefined, unique: boolean, count: number) => {
    try {
      const userId = user ? user : localStorage.getItem('userId');
      const data = await SpotifyService.getRecentlyPlayed(userId);
      let trackList = data.items.map((item: TrackItem) => ({
        name: item.track.name,
        artist: item.track.artists.map((artist) => artist.name).join(', '),
        albumArt: item.track.album.images[0]?.url || '',
        playedAt: item.played_at,
        url: item.track.external_urls.spotify,
      }));

      if (unique) {
        const seen = new Set();
        trackList = trackList.filter((track: TrackDisplay) => {
          if (seen.has(track.name)) return false;
          seen.add(track.name);
          return true;
        });
      }

      tracks.value = trackList.slice(0, count);
    } catch (error) {
      console.error('Failed to fetch recently played songs:', error);
    }
  };

  return {
    tracks,
    fetchRecentlyPlayed,
  };
}
