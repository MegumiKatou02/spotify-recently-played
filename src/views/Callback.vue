<template>
  <div>
    <h1>Processing...</h1>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'CallBack',
  setup() {
    const route = useRoute();
    const router = useRouter();

    const code = route.query.code as string;

    if (code) {
      const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
      const clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;
      // const redirectUri = 'http://localhost:5173/callback'
      const redirectUri = 'https://spotify-recent-tracks.vercel.app/callback';
      const tokenEndpoint = 'https://accounts.spotify.com/api/token';

      const formData = new URLSearchParams();
      formData.append('grant_type', 'authorization_code');
      formData.append('code', code);
      formData.append('redirect_uri', redirectUri);
      formData.append('client_id', clientId);
      formData.append('client_secret', clientSecret);

      axios.post(tokenEndpoint, formData)
        .then(response => {
          const accessToken = response.data.access_token;
          localStorage.setItem('spotifyAccessToken', accessToken);
          router.push('/recent');
        })
        .catch(error => {
          console.error('Error obtaining access token:', error);
          router.push('/error');
        });
    } else {
      console.error('No authorization code received.');
      router.push('/error');
    }
  },
});
</script>
