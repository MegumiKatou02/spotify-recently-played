<template>
  <div class="track-item">
    <img :src="track.album.images[0].url" :alt="track.name" class="album-cover" />
    <div class="track-info">
      <a :href="track.external_urls.spotify" target="_blank" rel="noopener noreferrer">
        {{ track.name }}
      </a>
      <p class="artist-name">{{ artists }}</p>
    </div>
    <span class="played-at">{{ formatDate(playedAt) }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

interface Artist {
  name: string;
}

interface Track {
  name: string;
  artists: Artist[];
  album: {
    images: Array<{ url: string }>;
  };
  external_urls: {
    spotify: string;
  };
}

export default defineComponent({
  name: 'TrackListItem',
  props: {
    track: {
      type: Object as () => Track,
      required: true,
    },
    playedAt: {
      type: String,
      required: true,
    },
  },
  computed: {
    artists(): string {
      return this.track.artists.map((artist: Artist) => artist.name).join(', ');
    },
  },
  methods: {
    formatDate(dateString: string): string {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    },
  },
});
</script>
