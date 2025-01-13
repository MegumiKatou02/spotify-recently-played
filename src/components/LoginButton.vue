<template>
  <div class="login-container">
    <div class="header">
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg"
        alt="Spotify Logo"
        class="header-logo"
      />
      <h1 class="title">Spotify Recently Played</h1>
      <p class="description">
        Connect with Spotify to view your recently played tracks.
      </p>
    </div>

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

    <div class="footer">
      <p>
        View source code on
        <a
          href="https://github.com/MegumiKatou02/spotify-recently-played"
          target="_blank"
          rel="noopener noreferrer"
          class="github-link"
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg"
            alt="GitHub Logo"
            class="github-logo"
          />
          GitHub
        </a>
      </p>
    </div>
  </div>
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
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #191414;
  color: white;
  padding: 20px;
  text-align: center;
}

.header {
  margin-bottom: 32px;
}

.header-logo {
  width: 64px;
  height: 64px;
  margin-bottom: 16px;
  filter: brightness(0) invert(1);
}

.title {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 8px;
}

.description {
  font-size: 16px;
  color: #b3b3b3;
}

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

.footer {
  margin-top: 60px;
  color: #b3b3b3;
}

.github-link {
  display: inline-flex;
  align-items: center;
  color: #1db954;
  text-decoration: none;
  transition: color 0.3s ease;
}

.github-link:hover {
  color: #1ed760;
}

.github-logo {
  width: 20px;
  height: 20px;
  margin-right: 8px;
  filter: brightness(0) invert(1);
}
</style>
