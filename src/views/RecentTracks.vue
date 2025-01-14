<template>
  <div class="recent-tracks-container">
    <div class="header">
      <h1 class="title">Recently Played Tracks</h1>
      <p class="description">Your recently played tracks on Spotify.</p>
    </div>

    <div v-if="isLoading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Loading your tracks...</p>
    </div>

    <ul v-else-if="tracks?.items.length" class="tracks-list">
      <li
        v-for="(item, index) in tracks.items"
        :key="index"
        class="track-item"
        @click="openTrack(item.track.external_urls.spotify)"
      >
        <img
          :src="item.track.album.images[0]?.url"
          :alt="item.track.name"
          class="album-art"
        />
        <div class="track-info">
          <p class="track-name">{{ item.track.name }}</p>
          <p class="artist-name">
            {{ item.track.artists[0]?.name || 'Unknown Artist' }}
          </p>
          <p class="played-at">
            Played on {{ formatDate(item.played_at) }}
          </p>
        </div>
      </li>
    </ul>

    <p v-else class="no-tracks">No tracks found.</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { SpotifyService } from '../services/SpotifyService';

interface Track {
  track: {
    name: string;
    artists: Array<{ name: string }>;
    album: {
      images: Array<{ url: string }>;
    };
    external_urls: {
      spotify: string;
    };
  };
  played_at: string;
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
  methods: {
    formatDate(dateString: string): string {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    },
    openTrack(url: string) {
      window.open(url, '_blank');
    },
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

<style scoped>
.recent-tracks-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Circular Std', Arial, sans-serif;
  color: white;
  background-color: #191414;
}

.header {
  text-align: center;
  margin-bottom: 2rem;
}

.title {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.description {
  font-size: 1rem;
  color: #b3b3b3;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 2rem;
}

.loading-spinner {
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid #1db954;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.tracks-list {
  list-style: none;
  padding: 0;
}

.track-item {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: #282828;
  border-radius: 8px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
}

.track-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.album-art {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  margin-right: 1rem;
}

.track-info {
  flex: 1;
}

.track-name {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 0.25rem;
}

.artist-name {
  font-size: 1rem;
  color: #b3b3b3;
  margin-bottom: 0.25rem;
}

.played-at {
  font-size: 0.875rem;
  color: #b3b3b3;
}

.no-tracks {
  text-align: center;
  font-size: 1.2rem;
  color: #b3b3b3;
  margin-top: 2rem;
}
</style>
