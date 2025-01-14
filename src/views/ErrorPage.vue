<template>
  <div class="error-container">
    <div class="error-content">
      <h1 class="error-title">Oops! An error occurred.</h1>
      <p class="error-message">Please try again later.</p>
      <router-link to="/" class="home-button">Back to Home</router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ErrorPage',
});
</script>

<style scoped>
.error-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #191414;
  color: white;
  font-family: 'Circular Std', Arial, sans-serif;
  text-align: center;
}

.error-content {
  max-width: 600px;
  padding: 2rem;
  background-color: #282828;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.error-title {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #1db954;
}

.error-message {
  font-size: 1.25rem;
  color: #b3b3b3;
  margin-bottom: 2rem;
}

.home-button {
  display: inline-block;
  padding: 12px 24px;
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
</style>
