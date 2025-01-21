<template>
  <div class="loading-container">
      <div class="loading-spinner"></div>
      <p>Processing...</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { db } from '@/config/Firebase';
import { collection, doc, setDoc } from 'firebase/firestore';

export default defineComponent({
  name: 'CallBack',
  setup() {
    const route = useRoute();
    const router = useRouter();
    const spotifyApiBase = 'https://api.spotify.com/v1'

    onMounted(async () => {
      const code = route.query.code as string;

      if (!code) {
        console.error('No authorization code received.');
        localStorage.removeItem('spotifyAccessToken');
        router.push('/error');
        return;
      }

      try {
        const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
        const clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;
        const redirectUri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;
        const tokenEndpoint = 'https://accounts.spotify.com/api/token';

        const formData = new URLSearchParams();
        formData.append('grant_type', 'authorization_code');
        formData.append('code', code);
        formData.append('redirect_uri', redirectUri);
        formData.append('client_id', clientId);
        formData.append('client_secret', clientSecret);

        const response = await axios.post(tokenEndpoint, formData);
        const accessToken = response.data.access_token;

        const headers = {
          Authorization: `Bearer ${accessToken}`,
        };

        const resUser = await axios.get(`${spotifyApiBase}/me`, { headers });

        const expiresIn = response.data.expires_in;
        const refreshToken = response.data.refresh_token;

        const userId = resUser.data.id;
        await setDoc(doc(collection(db, 'spotifyTokens'), userId), {
          accessToken,
          refreshToken,
          expiresAt: Date.now() + expiresIn * 1000,
        });
        localStorage.setItem('userId', userId);

        router.push('/recently');
      } catch (error) {
        console.error('Error obtaining access token:', error);
        router.push('/error');
      }
    });

    return {};
  },
});
</script>

<style scoped>
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
  margin-bottom: 12px;
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
</style>
