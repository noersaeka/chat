<script setup lang="ts">
import { ref, nextTick, watch } from 'vue'
import { useWebSocket } from '@/composables/useWebSocket'
import MessageBubble from './MessageBubble.vue'

const props = defineProps<{
  username: string
  recipient: string
  recipientAvatar: string
  wsUrl: string
}>()

const emit = defineEmits<{
  focus: []
  blur: []
}>()

const { messages, isConnected, remoteTyping, sendMessage, sendTyping, sendStopTyping } =
  useWebSocket(props.wsUrl, props.username)

const inputText = ref('')
const messageList = ref<HTMLElement | null>(null)

let typingTimer: ReturnType<typeof setTimeout> | null = null

function handleSend() {
  const text = inputText.value.trim()
  if (!text) return
  sendMessage(text)
  inputText.value = ''
}

function handleInput() {
  sendTyping()
  if (typingTimer) clearTimeout(typingTimer)
  typingTimer = setTimeout(() => {
    sendStopTyping()
  }, 1000)
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleSend()
  }
}

// Auto-scroll to bottom when new messages arrive
watch(
  () => messages.value.length,
  async () => {
    await nextTick()
    if (messageList.value) {
      messageList.value.scrollTop = messageList.value.scrollHeight
    }
  },
)
</script>

<template>
  <div class="chat-window">
    <div class="chat-header">
      <div class="user-info">
        <img :src="recipientAvatar" :alt="recipient" class="avatar" />
        <span class="username-label">{{ recipient }}</span>
      </div>
      <div class="connection-status" :class="{ connected: isConnected }">
        <span class="status-dot"></span>
        {{ isConnected ? 'Online' : 'Offline' }}
      </div>
    </div>

    <div ref="messageList" class="message-list">
      <TransitionGroup name="message">
        <MessageBubble
          v-for="msg in messages"
          :key="msg.id"
          :message="msg"
          :is-outgoing="msg.username === username"
        />
      </TransitionGroup>

      <div v-if="remoteTyping" class="typing-indicator">
        <span class="typing-dots">
          <span></span>
          <span></span>
          <span></span>
        </span>
        {{ remoteTyping }} is typing...
      </div>
    </div>

    <div class="chat-input">
      <input
        v-model="inputText"
        type="text"
        placeholder="Type a message..."
        @input="handleInput"
        @keydown="handleKeydown"
        @focus="emit('focus')"
        @blur="emit('blur')"
      />
      <button :disabled="!inputText.trim() || !isConnected" @click="handleSend">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M22 2L11 13" />
          <path d="M22 2L15 22L11 13L2 9L22 2Z" />
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
.chat-window {
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: 100%;
  width: 100%;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
}

.username-label {
  font-weight: 600;
  font-size: 15px;
  color: #1e293b;
}

.connection-status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #ef4444;
}

.connection-status.connected {
  color: #22c55e;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ef4444;
}

.connection-status.connected .status-dot {
  background: #22c55e;
}

.message-list {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 20px 0;
  scroll-behavior: smooth;
}

.typing-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  font-size: 12px;
  color: #64748b;
  font-style: italic;
}

.typing-dots {
  display: flex;
  gap: 3px;
}

.typing-dots span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #94a3b8;
  animation: typing-bounce 1.4s infinite;
}

.typing-dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-dots span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing-bounce {
  0%,
  60%,
  100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-4px);
  }
}

.chat-input {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 20px;
  border-top: 1px solid #e2e8f0;
  background: #f8fafc;
}

.chat-input input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 24px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
  background: #fff;
}

.chat-input input:focus {
  border-color: #6366f1;
}

.chat-input button {
  width: 42px;
  height: 42px;
  border: none;
  border-radius: 50%;
  background: #6366f1;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    background 0.2s,
    transform 0.1s;
}

.chat-input button:hover:not(:disabled) {
  background: #4f46e5;
  transform: scale(1.05);
}

.chat-input button:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
}

/* TransitionGroup animations */
.message-enter-active {
  transition: all 0.3s ease-out;
}

.message-leave-active {
  transition: all 0.2s ease-in;
}

.message-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.message-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.message-move {
  transition: transform 0.3s ease;
}
</style>
