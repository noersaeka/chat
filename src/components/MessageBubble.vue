<script setup lang="ts">
import type { ChatMessage } from '@/composables/useWebSocket'

const props = defineProps<{
  message: ChatMessage
  isOutgoing: boolean
}>()

function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<template>
  <div class="message-bubble" :class="{ outgoing: props.isOutgoing, incoming: !props.isOutgoing }">
    <div class="bubble-content">
      <span class="username">{{ props.message.username }}</span>
      <p class="text">{{ props.message.content }}</p>
      <span class="timestamp">{{ formatTime(props.message.timestamp) }}</span>
    </div>
  </div>
</template>

<style scoped>
.message-bubble {
  display: flex;
  margin-bottom: 12px;
  padding: 0 16px;
}

.message-bubble.outgoing {
  justify-content: flex-end;
}

.message-bubble.incoming {
  justify-content: flex-start;
}

.bubble-content {
  max-width: 70%;
  padding: 10px 14px;
  border-radius: 16px;
  position: relative;
}

.outgoing .bubble-content {
  background: #6366f1;
  color: #fff;
  border-bottom-right-radius: 4px;
}

.incoming .bubble-content {
  background: #f1f5f9;
  color: #1e293b;
  border-bottom-left-radius: 4px;
}

.username {
  display: block;
  font-size: 11px;
  font-weight: 600;
  margin-bottom: 2px;
  opacity: 0.8;
}

.outgoing .username {
  color: #c7d2fe;
}

.incoming .username {
  color: #64748b;
}

.text {
  margin: 0;
  font-size: 14px;
  line-height: 1.4;
  word-wrap: break-word;
}

.timestamp {
  display: block;
  font-size: 10px;
  margin-top: 4px;
  opacity: 0.6;
  text-align: right;
}
</style>
