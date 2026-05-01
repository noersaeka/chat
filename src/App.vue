<script setup lang="ts">
import { ref } from 'vue'
import ChatWindow from '@/components/ChatWindow.vue'

const WS_URL = import.meta.env.VITE_WS_URL ?? 'ws://localhost:3001'

// Store usernames in localStorage
const userA = localStorage.getItem('chatUserA') || 'John Doe'
const userB = localStorage.getItem('chatUserB') || 'Jane Doe'
localStorage.setItem('chatUserA', userA)
localStorage.setItem('chatUserB', userB)

const activePanel = ref<'A' | 'B' | null>(null)
</script>

<template>
  <div class="app-container">
    <header class="app-header">
      <h1>Totally Cool Real Time Chat</h1>
    </header>
    <div class="chat-grid">
      <img
        src="/avatars/john-doe.png"
        alt="John Doe"
        class="character-img"
        :class="{ active: activePanel === 'A' }"
      />
      <ChatWindow
        :username="userA"
        :recipient="userB"
        recipient-avatar="/avatars/jane-doe-avatar.png"
        :ws-url="WS_URL"
        @focus="activePanel = 'A'"
        @blur="activePanel = null"
      />
      <div class="divider"></div>
      <ChatWindow
        :username="userB"
        :recipient="userA"
        recipient-avatar="/avatars/john-doe-avatar.png"
        :ws-url="WS_URL"
        @focus="activePanel = 'B'"
        @blur="activePanel = null"
      />
      <img
        src="/avatars/jane-doe.png"
        alt="Jane Doe"
        class="character-img"
        :class="{ active: activePanel === 'B' }"
      />
    </div>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family:
    'Inter',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  height: 100vh;
  overflow: hidden;
}

#app {
  height: 100vh;
  overflow: hidden;
}
</style>

<style scoped>
.app-container {
  padding: 24px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 1600px;
  margin: 0 auto;
  width: 100%;
  overflow: hidden;
}

.app-header {
  text-align: center;
  margin-bottom: 24px;
}

.app-header h1 {
  color: #fff;
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 4px;
}

.app-header p {
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
}

.chat-grid {
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: center;
  gap: 0;
  flex: 1 1 0;
  min-height: 0;
  overflow: hidden;
  width: 100%;
}

.chat-grid :deep(.chat-window) {
  flex: 1;
  min-width: 0;
  max-width: 480px;
}

.divider {
  flex-shrink: 0;
  width: 1px;
  height: 70%;
  background: rgba(255, 255, 255, 0.3);
  align-self: center;
  margin: 0 32px;
}

.character-img {
  flex-shrink: 0;
  width: 160px;
  height: 80%;
  object-fit: contain;
  object-position: bottom;
  align-self: flex-end;
  transform-origin: bottom center;
  transition:
    transform 0.3s ease,
    filter 0.3s ease;
}

.character-img.active {
  transform: scale(1.12);
  filter: drop-shadow(0 8px 24px rgba(0, 0, 0, 0.25));
}

@media (max-width: 768px) {
  .app-container {
    padding: 16px;
    height: 100dvh;
    justify-content: flex-start;
  }

  .app-header {
    margin-bottom: 12px;
  }

  .app-header h1 {
    font-size: 20px;
  }

  .chat-grid {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
    overflow-y: auto;
    height: auto;
    flex: 1 1 0;
  }

  .chat-grid :deep(.chat-window) {
    max-width: 100%;
    height: 45dvh;
  }

  .character-img {
    display: none;
  }

  .divider {
    display: none;
  }
}
</style>
