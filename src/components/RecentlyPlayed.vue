<template>
  <div class="recently-played" :style="{ width: `${queryParams.width || 400}px` }">
    <div class="header">
      <img src="https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg" alt="Spotify Logo" class="spotify-logo" />
      <span>Recently Played</span>
    </div>
    <div v-if="tracks.length > 0">
      <div v-for="(track, index) in tracks" :key="index" class="track-item">
        <img :src="track.albumArt" alt="Album Cover" class="album-art" @click="openTrack(track.url)" />
        <div class="track-info">
          <p class="track-name" @click="openTrack(track.url)">{{ track.name }}</p>
          <p class="track-artist">{{ track.artist }}</p>
        </div>
        <p class="track-time">{{ formatTime(track.playedAt) }}</p>
      </div>
    </div>
    <p v-else>Loading...</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import * as constants from "@/utils/Constants"
import { SpotifyService } from "@/services/SpotifyService";
import type { TrackItem } from "@/types/SpotifyTypes";

interface TrackDisplay {
  name: string;
  artist: string;
  albumArt: string;
  playedAt: string;
  url: string;
}

const route = useRoute();

const queryParams = computed(() => ({
  user: route.query.user as string | undefined,
  width: route.query.width ?
  (Number(route.query.width) > constants.maxWidth || Number(route.query.width) < constants.minWidth ? constants.defaultWidth : Number(route.query.width)) :
  constants.defaultWidth,
  unique: route.query.unique === "true",
  count: route.query.count ?
  (Number(route.query.count) > constants.maxCount || Number(route.query.count) < constants.minCount ? constants.defaultCount :
    Number(route.query.count)) : constants.defaultCount,
}));

const tracks = ref<TrackDisplay[]>([]);;

const openTrack = (url: string) => {
  window.open(url, "_blank");
};

const fetchRecentlyPlayed = async () => {
  try {
    const data = await SpotifyService.getRecentlyPlayed();
    let trackList = data.items.map((item: TrackItem) => ({
      name: item.track.name,
      artist: item.track.artists.map((artist) => artist.name).join(", "),
      albumArt: item.track.album.images[0]?.url || "",
      playedAt: item.played_at,
      url: item.track.external_urls.spotify,
    }));

    if (queryParams.value.unique) {
      const seen = new Set();
      trackList = trackList.filter((track: TrackDisplay) => {
        if (seen.has(track.name)) return false;
        seen.add(track.name);
        return true;
      });
    }

    tracks.value = trackList.slice(0, queryParams.value.count);
  } catch (error) {
    console.error("Failed to fetch recently played songs:", error);
  }
};

const formatTime = (isoTime: string) => {
  const date = new Date(isoTime);
  return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(
    Math.round((date.getTime() - new Date().getTime()) / 1000 / 60 / 60),
    "hour"
  );
};

onMounted(fetchRecentlyPlayed);

</script>
<style scoped>
.recently-played {
  width: 400px;
  background: #181818;
  color: white;
  padding: 15px;
  border-radius: 8px;
  font-family: Arial, sans-serif;
}

.header {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.2em;
  font-weight: bold;
  margin-bottom: 15px;
}

.spotify-logo {
  width: 20px;
}

.track-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.album-art {
  width: 50px;
  height: 50px;
  border-radius: 5px;
  cursor: pointer;
}

.track-info {
  flex-grow: 1;
}

.track-name {
  font-weight: bold;
  cursor: pointer;
  transition: color 0.15s ease;
}

.track-name:hover {
  color: #1db954;
}
.track-artist {
  font-size: 0.9em;
  color: #aaa;
}

.track-time {
  font-size: 0.8em;
  color: #777;
}
</style>
