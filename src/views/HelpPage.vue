<template>
  <div class="help-container">
    <h1>🎵 Spotify README Generator</h1>
    <p>Below are links to help you use this feature:</p>

    <div class="link-list">
      <div v-for="(link, index) in links" :key="index" class="link-item">
        <span class="link-name">{{ link.name }}</span>
        <div class="input-container">
          <input type="text" :value="link.url" readonly />
          <button @click="copyToClipboard(link.url, index)" class="copy-button">
            <span v-if="copiedIndex === index">Copied!</span>
            <span v-else>Copy</span>
          </button>
        </div>
      </div>
    </div>
    <div class="button-footer">
      <router-link to="/" class="home-button">Back to Home</router-link>
      <router-link to="/recently" class="home-button">Recently Played</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const links = ref([
  { name: "Markdown code snippet", url: "https://spotify-recently-tracks.vercel.app/api?user={user_id}" },
  { name: "For custom count (1 ≤ {count} ≤ 10)", url: "https://spotify-recently-tracks.vercel.app/api?count={count}" },
  { name: "For custom width (300 ≤ {width} ≤ 1000)", url: "https://spotify-recently-tracks.vercel.app/api?width={width}" },
  { name: "For unique tracks", url: "https://spotify-recently-tracks.vercel.app/api?unique={true|false}" }
]);

const copiedIndex = ref<number | null>(null);

const copyToClipboard = async (text: string, index: number) => {
  try {
    await navigator.clipboard.writeText(text);
    copiedIndex.value = index;
    setTimeout(() => {
      copiedIndex.value = null;
    }, 2000);
  } catch (err) {
    console.error("Copy failed:", err);
  }
};
</script>

<style scoped>
.help-container {
  max-width: 900px;
  width: 90%;
  margin: 50px auto;
  padding: 25px;
  border-radius: 12px;
  background: linear-gradient(135deg, #ffffff, #f2f2f2);
  text-align: center;
  box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.1);
}

h1 {
  font-size: 26px;
  margin-bottom: 10px;
  color: #333;
  font-weight: bold;
}

p {
  font-size: 16px;
  margin-bottom: 20px;
  color: #555;
}

.link-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.link-item {
  display: flex;
  flex-direction: column;
  background: white;
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.link-item:hover {
  transform: translateY(-2px);
  box-shadow: 0px 6px 15px rgba(0, 0, 0, 0.15);
}

.link-name {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 6px;
}

.input-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 6px;
  text-align: center;
  font-size: 14px;
  color: #555;
  background: #f9f9f9;
}

.copy-button {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 7px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  min-width: 80px;
  transition: background-color 0.2s, transform 0.1s;
}

.copy-button:hover {
  background-color: #3e8e41;
  transform: scale(1.05);
}

.home-button {
  display: inline-block;
  padding: 12px 24px;
  margin-top: 15px;
  background-color: #1db954;
  color: white;
  font-size: 1rem;
  font-weight: bold;
  text-decoration: none;
  border-radius: 50px;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.home-button:hover {
  background-color: #1ed760;
  transform: scale(1.05);
}

.home-button:active {
  transform: scale(0.95);
}

.button-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  column-gap: 30px;
}

@media (max-width: 600px) {
  .help-container {
    width: 95%;
    padding: 15px;
  }
  .copy-button {
    min-width: 40px;
  }
}

@media (prefers-color-scheme: dark) {
  .help-container {
    background: linear-gradient(135deg, #2a2a2a, #1f1f1f);
    color: white;
  }

  h1 {
    color: #f0f0f0;
  }

  p {
    color: #ccc;
  }

  .link-item {
    background: #333;
    box-shadow: 0px 4px 10px rgba(255, 255, 255, 0.1);
  }

  .link-name {
    color: #f0f0f0;
  }

  input {
    background: #444;
    color: #ddd;
    border: 1px solid #666;
  }

  .copy-button {
    background-color: #28a745;
  }

  .copy-button:hover {
    background-color: #218838;
  }

  .back-button {
    background: linear-gradient(135deg, #0066cc, #004080);
  }

  .back-button:hover {
    background: linear-gradient(135deg, #004080, #00264d);
  }
}
</style>
