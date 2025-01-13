<template>
  <button
    @click="authorizeSpotify"
    :disabled="isLoading"
    class="spotify-login-button"
  >
    <img
      src="https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg"
      alt="Spotify Logo"
      class="spotify-logo"
    />
    <span>{{ isLoading ? 'Redirecting...' : 'Authorize with Spotify' }}</span>
  </button>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'LoginButton',
  setup() {
    const isLoading = ref(false);

    const authorizeSpotify = () => {
      isLoading.value = true;
      const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
      const redirectUri = 'https://spotify-recent-tracks.vercel.app/callback';
      const scope = 'user-read-recently-played';
      const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}`;

      window.location.href = authUrl;
    };

    return {
      authorizeSpotify,
      isLoading,
    };
  },
});
</script>

<style scoped>
.spotify-login-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  background-color: #1db954;
  color: white;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.spotify-login-button:hover {
  background-color: #1ed760;
  transform: scale(1.05);
}

.spotify-login-button:disabled {
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
</style>
