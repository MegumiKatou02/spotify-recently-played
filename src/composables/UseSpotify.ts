import { ref } from 'vue';
import { SpotifyService } from '@/services/SpotifyService';
import type { TrackItem, TrackDisplay } from '@/types/SpotifyTypes';


export function useSpotify() {
  const userId = ref<string | null>(null);
  const tracks = ref<TrackDisplay[]>([]);

  const fetchRecentlyPlayed = async (unique: boolean, count: number) => {
    try {
      const data = await SpotifyService.getRecentlyPlayed();
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

  const fetchUserId = async () => {
    try {
      userId.value = await SpotifyService.getUserId();
    } catch (error) {
      console.error('Error to fetch', error);
    }
  };

  return {
    userId,
    tracks,
    fetchRecentlyPlayed,
    fetchUserId,
  };
}
