<template>
  <div class="recently-played" :style="{ width: `${queryParams.width || 400}px` }">
    <div class="header">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 168 168" class="spotify-logo"
      @click="redirectToUrl(userId ? `https://open.spotify.com/user/${userId}` : `https://open.spotify.com`)">
        <path
          fill="#1DB954"
          d="M83.996 0C37.747 0 0 37.747 0 84c0 46.251 37.747 83.996 83.996 83.996C130.249 167.996 168 130.249 168 84 168 37.747 130.249 0 83.996 0zm38.326 120.878c-1.497 2.451-4.687 3.212-7.139 1.715-19.598-11.991-44.296-14.707-73.326-8.067-2.809.644-5.609-1.117-6.249-3.925-.643-2.809 1.117-5.609 3.926-6.249 31.901-7.288 59.263-4.15 81.337 9.387 2.452 1.497 3.213 4.688 1.715 7.139zm10.235-22.802c-1.893 3.073-5.912 4.037-8.981 2.144-22.505-13.84-56.822-17.843-83.447-9.761-3.453 1.043-7.1-.903-8.148-4.352-1.044-3.453.907-7.093 4.359-8.139 30.485-9.238 68.341-4.758 94.056 11.127 3.07 1.89 4.034 5.91 2.143 8.981zm.875-23.744c-26.994-16.031-71.52-17.505-97.289-9.684-4.138 1.255-8.514-1.081-9.768-5.219-1.254-4.14 1.08-8.513 5.221-9.771 29.581-8.98 78.756-7.245 109.83 11.202 3.722 2.209 4.943 7.016 2.737 10.733-2.2 3.722-7.02 4.949-10.731 2.739z"
        />
      </svg>
      <p id="spotify-header" @click="redirectToUrl(userId ? `https://open.spotify.com/user/${userId}` : `https://open.spotify.com`)" >Spotify</p>
      <p>Recently Played</p>
    </div>

    <div v-if="tracks.length > 0" class="tracks-container">
      <div v-for="(track, index) in tracks"
           :key="index"
           class="track-item">
        <div class="album-art" @click="openTrack(track.url)">
          <img
            v-if="track.albumArt"
            :src="track.albumArt"
            :alt="track.name"
            class="album-image"
          >
          <div v-else class="album-placeholder">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              class="placeholder-icon"
            >
              <path
                fill="currentColor"
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5zm0-5.5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"
              />
            </svg>
          </div>
        </div>

        <div class="track-info">
          <p class="track-name" @click="openTrack(track.url)">{{ track.name }}</p>
          <p class="track-artist">{{ track.artist }}</p>
        </div>

        <span class="track-time">{{ formatTime(track.playedAt) }}</span>
      </div>
    </div>
    <p v-else-if="isCheckingUser" class="loading">Loading...</p>
    <p v-else-if="!isUserExist" class="loading">User ID not found. Please try again</p>
  </div>
</template>

<script lang="ts">
import { onMounted, computed, defineComponent, ref, onBeforeMount } from 'vue';
import { useRoute } from 'vue-router';
import * as constants from '@/utils/Constants';
import { useSpotify } from '@/composables/UseSpotify';
import { isDocExist } from '@/services/AuthService';

export default defineComponent({
  name: 'RecentlyPlayed',
  setup() {
    const { tracks, fetchRecentlyPlayed } = useSpotify();

    const route = useRoute();
    const queryParams = computed(() => ({
      user: route.query.user as string | undefined,
      width: route.query.width ?
        (Number(route.query.width) > constants.maxWidth || Number(route.query.width) < constants.minWidth ?
          constants.defaultWidth : Number(route.query.width)) :
        constants.defaultWidth,
      unique: route.query.unique === 'true',
      count: route.query.count ?
        (Number(route.query.count) > constants.maxCount || Number(route.query.count) < constants.minCount ?
          constants.defaultCount : Number(route.query.count)) :
        constants.defaultCount,
    }));

    const userId = ref<string | undefined>(queryParams.value.user);
    const isUserExist = ref<boolean>(false);
    const isCheckingUser = ref<boolean>();

    const openTrack = (url: string) => {
      window.open(url, '_blank');
    };

    const redirectToUrl = (url: string) => {
      openTrack(url);
    }

    const formatTime = (isoTime: string) => {
      const date = new Date(isoTime);
      const diffInSeconds = Math.round(Math.abs((date.getTime() - new Date().getTime()) / 1000));

      if (diffInSeconds < 60) {
        return `${diffInSeconds} seconds ago`;
      } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
      } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
      } else {
        const days = Math.floor(diffInSeconds / 86400);
        return `${days} day${days !== 1 ? 's' : ''} ago`;
      }
    };

    onBeforeMount(async () => {
    if (userId.value) {
      isCheckingUser.value = true;
      isUserExist.value = await isDocExist(userId.value);
      isCheckingUser.value = false;
    }
  });

    onMounted(async () => {
      await fetchRecentlyPlayed(queryParams.value.user, queryParams.value.unique, queryParams.value.count);
    });

    return {
      userId,
      tracks,
      queryParams,
      openTrack,
      redirectToUrl,
      formatTime,
      isUserExist,
      isCheckingUser,
    }
  },
});

</script>

<style scoped>
#spotify-header {
  color: #1db954;
  font-weight: bold;
  font-size: larger;
  margin-right: 10px;
}

.recently-played {
  background: #181818;
  color: white;
  padding: 1rem;
  border-radius: 8px;
  font-family: Arial, sans-serif;
}

.header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.2em;
  font-weight: bold;
  margin-bottom: 1rem;
}

.spotify-logo {
  width: 2rem;
  height: 2rem;
}

.spotify-logo, #spotify-header {
  cursor: pointer;
}

.tracks-container {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.track-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.album-art {
  width: 3rem;
  height: 3rem;
  border-radius: 0.375rem;
  overflow: hidden;
  cursor: pointer;
  flex-shrink: 0;
  background: #282828;
}

.album-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.2s;
}

.album-image:hover {
  transform: scale(1.05);
}

.album-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
}

.placeholder-icon {
  width: 1.5rem;
  height: 1.5rem;
}

.track-info {
  flex: 1;
  min-width: 0;
}

.track-name {
  font-weight: 500;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  transition: color 0.2s;
}

.track-name:hover {
  color: #1db954;
}

.track-artist {
  font-size: 0.875rem;
  color: #9ca3af;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.track-time {
  font-size: 0.75rem;
  color: #6b7280;
  white-space: nowrap;
}

.loading {
  text-align: center;
  color: #9ca3af;
  padding: 1rem 0;
}
</style>
