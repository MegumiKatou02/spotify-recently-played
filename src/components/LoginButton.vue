<template>
  <button @click="authorizeSpotify" :disabled="isLoading">
    {{ isLoading ? 'Redirecting...' : 'Authorize with Spotify' }}
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
