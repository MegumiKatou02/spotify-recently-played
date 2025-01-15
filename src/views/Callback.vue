<template>
  <div>
    <h1>Processing...</h1>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

export default defineComponent({
  name: 'CallBack',
  setup() {
    const route = useRoute();
    const router = useRouter();

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

        localStorage.setItem('spotifyAccessToken', accessToken);
        router.push('/recently');
      } catch (error) {
        console.error('Error obtaining access token:', error);
        localStorage.removeItem('spotifyAccessToken');
        router.push('/error');
      }
    });

    return {};
  },
});
</script>
