<template>
  <div class="container">
    <h1>Spotify Recently Played README Generator</h1>
    <button @click="authorizeSpotify" v-if="!isAuthenticated">
      Authorize with Spotify
    </button>

    <div v-if="isAuthenticated">
      <h2>Your Markdown Code Snippet</h2>
      <pre>{{ markdownSnippet }}</pre>
      <button @click="copyToClipboard">Copy to Clipboard</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'ReadmeGenerator',
  setup() {
    const isAuthenticated = ref(false);
    const markdownSnippet = ref('');
    const userId = ref('');

    const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
    const redirectUri = 'https://spotify-recent-tracks.vercel.app/callback';

    const authorizeSpotify = () => {
      const scope = 'user-read-recently-played';
      const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(
        redirectUri
      )}&scope=${scope}`;
      window.location.href = authUrl;
    };

    const handleCallback = async (code: string) => {
      try {
        const response = await fetch('/api/auth/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code }),
        });
        const data = await response.json();
        userId.value = data.user_id;

        markdownSnippet.value = `![Alt text](https://your-domain.com/api?user=${userId.value})`;
        isAuthenticated.value = true;
      } catch (error) {
        console.error('Error handling callback:', error);
      }
    };

    const copyToClipboard = () => {
      navigator.clipboard.writeText(markdownSnippet.value);
      alert('Markdown code copied to clipboard!');
    };

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
      handleCallback(code);
    }

    return {
      isAuthenticated,
      markdownSnippet,
      authorizeSpotify,
      copyToClipboard,
    };
  },
});
</script>

<style>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
  font-family: Arial, sans-serif;
}

pre {
  background-color: #f4f4f4;
  padding: 1rem;
  border-radius: 8px;
  text-align: left;
}

button {
  padding: 0.5rem 1rem;
  background-color: #1db954;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

button:hover {
  background-color: #1ed760;
}
</style>
