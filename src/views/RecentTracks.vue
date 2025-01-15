<template>
  <div class="recent-tracks-container">
    <div class="header">
      <div class="title">
      <router-link to="/">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg"
          alt="Spotify Logo"
          class="header-logo"
        />
      </router-link>
        <h1 class="title">Recently Played Tracks</h1>
      </div>
      <p class="description">Your recently played tracks on Spotify.</p>
    </div>

    <div class="button-footer">
      <button
        v-if="!isLoading"
        @click="authorizeSpotify"
        :disabled="isLoading"
        class="spotify-navigator-button spotify-navigator-button__reauthorize"
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg"
          alt="Spotify Logo"
          class="spotify-logo"
        />
        <span>{{ isLoading_reauth ? 'Redirecting...' : 'Re-Authorize' }}</span>
      </button>

      <router-link to="/generate">
        <button
          v-if="!isLoading"
          :disabled="isLoading"
          class="spotify-navigator-button spotify-navigator-button__generate"
        >
          <span>{{ isLoading_generate ? 'Redirecting...' : 'Generate Readme' }}</span>
        </button>
      </router-link>

      <router-link to="/">
        <button
          v-if="!isLoading"
          :disabled="isLoading"
          class="spotify-navigator-button spotify-navigator-button__home"
        >
          <span>{{ isLoading_home ? 'Redirecting...' : 'Back to Home' }}</span>
        </button>
      </router-link>
    </div>

    <div v-if="isLoading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Loading your tracks...</p>
    </div>

    <ul v-else-if="tracks?.items.length" class="tracks-list">
      <transition-group name="fade">
        <li
          v-for="(item, index) in (showAll ? tracks.items : tracks.items.slice(0, 5))"
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
      </transition-group>
    </ul>

    <p v-else class="no-tracks">No tracks found.</p>

    <div class="button-container">
    <button
      v-if="tracks?.items.length !== undefined && tracks?.items.length > 5"
      class="toggle-button"
      @click="showAll = !showAll"
    >
      <span>{{ showAll ? "Show Less" : "Show More" }}</span>
      <span class="arrow" :class="{ expanded: showAll }">▼</span>
    </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
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
      showAll: false,
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
  setup() {
    const isLoading_reauth = ref(false);
    const isLoading_generate = ref(false);
    const isLoading_home = ref(false);

    const authorizeSpotify = () => {
      isLoading_reauth.value = true;
      const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
      const redirectUri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI
      const scope = 'user-read-recently-played';
      const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&show_dialog=true`;

      window.location.href = authUrl;
    };

    return {
      authorizeSpotify,
      isLoading_reauth,
      isLoading_generate,
      isLoading_home,
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

<style scoped>

.title {
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.header-logo {
  width: 48px;
  height: 48px;
  margin: 0;
  padding: 0;
  cursor: pointer;
  transform: translateY(12%);
}

.button-footer {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  text-align: center;
  gap: 10px;
  margin-bottom: 23px;
}

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

.spotify-navigator-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  height: 50px;
  background-color: #1db954;
  color: white;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.spotify-navigator-button:hover {
  transform: scale(1.05);
}

.spotify-navigator-button:disabled {
  background-color: #b3b3b3;
  cursor: not-allowed;
  transform: none;
}

.spotify-logo {
  width: 24px;
  height: 24px;
  margin-right: 12px;
  filter: brightness(0) invert(1);
}

.spotify-navigator-button__reauthorize {
background-color: #1ed760;
}

.spotify-navigator-button__reauthorize:hover {
background-color: #45A049;
}

.spotify-navigator-button__generate {
  background-color: #2196F3;
}

.spotify-navigator-button__generate:hover {
background-color: #1E88E5;
}

.spotify-navigator-button__home {
  background-color: #9E9E9E;
}

.spotify-navigator-button__home:hover {
  background-color: #757575;
}

.toggle-button {
  background-color: #1db954;
  color: white;
  font-size: 16px;
  padding: 10px 10px;
  /* margin-top: 10px 10px; */
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  display: flex;
  align-items: center;
  justify-content  : center;
  gap: 8px;
  /* display: block;
  margin: 10px auto; */
}

.toggle-button:hover {
  background-color: #17a74b;
  transform: scale(1.05);
}

.arrow {
  transition: transform 0.3s ease;
}

.arrow.expanded {
  transform: rotate(180deg);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s, transform 0.5s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.button-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

</style>
