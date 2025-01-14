<template>
  <div class="track-list-header">
    <a
      :href="`https://open.spotify.com/user/${username}`"
      target="_blank"
      rel="noopener noreferrer"
    >
      <img src="../../public/spotify.svg" alt="Spotify" class="spotify-icon" />
    </a>
    <span class="spotify-title">Recently Played</span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'TrackListHeader',
  props: {
    username: {
      type: String,
      required: true,
    },
  },
});
</script>

<style scoped>
.track-list-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.spotify-icon {
  width: 24px;
  height: 24px;
}

.spotify-title {
  font-size: 1.2rem;
  font-weight: bold;
}
</style>
