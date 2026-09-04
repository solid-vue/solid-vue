<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <div class="solid-vue-error">
    <!-- Gambar Logo solid-vue -->
    <div>
        <img src="/logo.png" alt="solid-vue Logo" class="logo"/>
    </div>
    <div class="error-code">404</div>
    <h1>Page Not Found</h1>
    <p>Page <code>{{ route.fullPath }}</code> is not found in this application.</p>
    <a href="/" class="back-link">← Back to Home</a>
  </div>
</template>

<style scoped>
.logo {
  width: 150px;
  height: auto;
  margin-bottom: 1rem;
  justify-content: center;
}
.solid-vue-error {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: system-ui, -apple-system, sans-serif;
  text-align: center;
  padding: 2rem;
  background-color: #01313f;
}
.error-code {
  font-size: 6rem;
  font-weight: 800;
  color: #e2e8f0;
  line-height: 1;
}
h1 {
  font-size: 1.5rem;
  margin: 0.5rem 0;
  color: #1e293b;
}
p {
  color: #64748b;
  margin-bottom: 1.5rem;
}
code {
  background: #f1f5f9;
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
  font-size: 0.9em;
}
.back-link {
  color: #10b981;
  text-decoration: none;
  font-weight: 600;
}
.back-link:hover {
  text-decoration: underline;
}
</style>