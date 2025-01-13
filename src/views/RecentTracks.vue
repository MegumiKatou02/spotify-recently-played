<template>
  <div>
    <h1>Recently Played Tracks</h1>
    <div v-if="isLoading">Loading...</div>
    <ul v-else-if="tracks?.items.length">
      <li v-for="(item, index) in tracks.items" :key="index">
        {{ item.track.name }} by {{ item.track.artists[0]?.name || 'Unknown Artist' }}
      </li>
    </ul>
    <p v-else>No tracks found.</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { SpotifyService } from '../services/SpotifyService';

interface Track {
  track: {
    name: string;
    artists: Array<{ name: string }>;
  };
}

interface RecentlyPlayedResponse {
  items: Track[];
}

export default defineComponent({
  name: 'RecentTracks',
  data() {
    return {
      tracks: null as RecentlyPlayedResponse | null,
      isLoading: true,
    };
  },
  async mounted() {
    try {
      const response = await SpotifyService.getRecentlyPlayed();
      if (response) {
        this.tracks = response;
      } else {
        console.error('No data returned from SpotifyService.');
      }
    } catch (error) {
      console.error('Error fetching recent tracks:', error);
    } finally {
      this.isLoading = false;
    }
  },
});
</script>
