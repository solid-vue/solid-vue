<script setup lang="ts">
import { ref, onMounted } from 'vue'

const revealed = ref(false)
onMounted(() => { 
  setTimeout(() => {
    revealed.value = true 
  }, 50)
})
</script>

<template>
  <div class="page">
    <div class="bg-glow"></div>

    <main class="content" :class="{ 'is-visible': revealed }">
      <div class="hero">
        <img src="/logo.png" alt="Solid-Vue" class="logo" />

        <span class="beta-badge">🧪 Early access — shaped by your feedback</span>

        <h1 class="headline">
          The framework for <br/>
          <span class="text-gradient">modern businesses.</span>
        </h1>
        
        <p class="lead-text">
          Solid&#8209;Vue is a lightweight Vue and Vite framework. It pairs file&#8209;based routing with a server layer built in, so your interface and your API live in one coherent project.
        </p>
        
        <div class="actions">
          <a href="https://solid-vue.tech/" class="btn btn-primary" target="_blank" rel="noopener">Get Started</a>
          <a href="https://github.com/joniilmanfahmi00-collab" class="btn btn-secondary" target="_blank" rel="noopener">View on GitHub</a>
        </div>
      </div>

      <div class="features-grid">
        <section class="feature-card">
          <div class="icon-wrapper">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12h16M4 12l5-5M4 12l5 5M20 12l-5-5M20 12l-5 5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <h2>File-based routing</h2>
          <p>Every file you add to <code>src/pages</code> becomes a route automatically, courtesy of unplugin&#8209;vue&#8209;router. No router configuration.</p>
        </section>

        <section class="feature-card">
          <div class="icon-wrapper">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="6" rx="1.5"/><rect x="4" y="14" width="16" height="6" rx="1.5"/><circle cx="8" cy="7" r="1.2" fill="currentColor"/><circle cx="8" cy="17" r="1.2" fill="currentColor"/></svg>
          </div>
          <h2>A server, built in</h2>
          <p><code>src/server/api</code> holds your endpoints. Solid&#8209;Vue runs them through h3 alongside your frontend — one deploy, not two.</p>
        </section>

        <section class="feature-card">
          <div class="icon-wrapper">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" stroke-linejoin="round"/></svg>
          </div>
          <h2>Vite underneath</h2>
          <p>Instant startup and near-instant updates as you edit, powered by Vite's world-class dev server.</p>
        </section>

        <section class="feature-card">
          <div class="icon-wrapper">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 4h9l5 5v11H5V4Z" stroke-linejoin="round"/><path d="M14 4v5h5" stroke-linejoin="round"/></svg>
          </div>
          <h2>Documentation</h2>
          <p>Learn the routing conventions, the server API, and discover add&#8209;ons to customise your project further.</p>
        </section>
      </div>

      <section class="feedback-cta">
        <h2>Help shape what's next</h2>
        <p>
          Solid&#8209;Vue is in early access. The features we build next come from what real
          projects actually need — not assumptions. If something's missing, broken, or could
          work better, we'd love to hear it.
        </p>
        <a href="https://forms.gle/6M2Jbqz6egE2RvEB7" class="btn btn-primary" target="_blank" rel="noopener">Give feedback</a>
      </section>
    </main>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700;800&display=swap');

.page {
  --primary: #1E8E4F;
  --primary-hover: #166b3b;
  --bg: #ffffff;
  --text-main: #0f172a;
  --text-muted: #64748b;
  --border: #e2e8f0;
  --card-bg: #ffffff;

  position: relative;
  min-height: 100vh;
  background: var(--bg);
  color: var(--text-main);
  font-family: 'Figtree', ui-sans-serif, system-ui, -apple-system, sans-serif;
  overflow-x: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.bg-glow {
  position: absolute;
  top: -15%;
  left: 50%;
  transform: translateX(-50%);
  width: 80vw;
  max-width: 800px;
  height: 500px;
  background: radial-gradient(circle, rgba(30, 142, 79, 0.12) 0%, rgba(255, 255, 255, 0) 70%);
  z-index: 0;
  pointer-events: none;
}

.content {
  position: relative;
  z-index: 1;
  max-width: 960px;
  padding: 4rem 2rem;
  opacity: 0;
  transform: translateY(24px);
  transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.content.is-visible {
  opacity: 1;
  transform: translateY(0);
}

:root {
  --primary: #1E8E4F;
  --primary-hover: #166b3b;
  --bg: #ffffff;
  --text-main: #0f172a;
  --text-muted: #64748b;
  --border: #e2e8f0;
  --card-bg: #ffffff;
}

.hero {
  text-align: center;
  margin-bottom: 5rem;
}

.logo {
  height: 64px;
  width: auto;
  margin: 0 auto 1.25rem;
  display: block;
}

.beta-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.9rem;
  margin-bottom: 1.5rem;
  background: #fff7ed;
  color: #9a5b13;
  border: 1px solid #fde3c4;
  border-radius: 99px;
  font-size: 0.85rem;
  font-weight: 600;
}

.headline {
  font-size: clamp(2.5rem, 5vw, 4.5rem);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.03em;
  margin: 0 0 1.5rem;
}

.text-gradient {
  background: linear-gradient(135deg, #1E8E4F 0%, #10b981 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.lead-text {
  font-size: 1.25rem;
  color: var(--text-muted);
  max-width: 600px;
  margin: 0 auto 2.5rem;
  line-height: 1.6;
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.875rem 1.75rem;
  font-size: 1.05rem;
  font-weight: 600;
  border-radius: 99px;
  text-decoration: none;
  transition: all 0.25s ease;
}

.btn-primary {
  background: var(--primary);
  color: white;
  box-shadow: 0 4px 14px rgba(30, 142, 79, 0.25);
}

.btn-primary:hover {
  background: var(--primary-hover);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(30, 142, 79, 0.35);
}

.btn-secondary {
  background: var(--card-bg);
  color: var(--text-main);
  border: 1px solid var(--border);
}

.btn-secondary:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.feature-card {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 2rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02);
  text-decoration: none;
}

.feature-card:hover {
  border-color: rgba(30, 142, 79, 0.4);
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.06);
}

.icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: #edf8f2;
  color: var(--primary);
  border-radius: 12px;
  margin-bottom: 1.5rem;
}

.icon-wrapper svg {
  width: 24px;
  height: 24px;
}

.feature-card h2 {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--text-main);
  margin: 0 0 0.75rem;
}

.feature-card p {
  margin: 0;
  color: var(--text-muted);
  font-size: 0.95rem;
  line-height: 1.6;
}

.feature-card code {
  background: #f1f5f9;
  color: #334155;
  padding: 0.2rem 0.4rem;
  border-radius: 6px;
  font-size: 0.85em;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

.feedback-cta {
  margin-top: 4rem;
  text-align: center;
  background: #f5fbf7;
  border: 1px solid #dcf5e4;
  border-radius: 20px;
  padding: 3rem 2rem;
}

.feedback-cta h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 0.75rem;
}

.feedback-cta p {
  color: var(--text-muted);
  max-width: 520px;
  margin: 0 auto 1.75rem;
  line-height: 1.6;
}

@media (max-width: 640px) {
  .content { padding: 3rem 1.5rem; }
  .actions { flex-direction: column; }
  .btn { width: 100%; }
  .feedback-cta { padding: 2.5rem 1.5rem; }
}
</style>