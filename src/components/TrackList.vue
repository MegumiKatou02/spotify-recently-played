<template>
  <div class="track-list">
    <TrackListHeader :username="username" />
    <div v-if="isLoading">Loading...</div>
    <div v-else>
      <TrackListItem
        v-for="(item, index) in tracks"
        :key="index"
        :track="item.track"
        :played-at="item.played_at"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import axios from 'axios';
import TrackListHeader from './TrackListHeader.vue';
import TrackListItem from './TrackListItem.vue';

interface Track {
  name: string;
  artists: Array<{ name: string }>;
  album: {
    images: Array<{ url: string }>;
  };
  external_urls: {
    spotify: string;
  };
}

interface PlayHistory {
  track: Track;
  played_at: string;
}

export default defineComponent({
  name: 'TrackList',
  components: {
    TrackListHeader,
    TrackListItem,
  },
  props: {
    username: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const tracks = ref<PlayHistory[]>([]);
    const isLoading = ref(true);

    const fetchRecentlyPlayed = async () => {
      try {
        const response = await axios.get('/api/recently-played', {
          params: {
            user: props.username,
          },
        });
        tracks.value = response.data.items;
      } catch (error) {
        console.error('Error fetching recently played tracks:', error);
      } finally {
        isLoading.value = false;
      }
    };

    onMounted(() => {
      fetchRecentlyPlayed();
    });

    return {
      tracks,
      isLoading,
    };
  },
});
</script>
