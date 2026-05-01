import { ref, onMounted, onUnmounted } from 'vue'

export interface ChatMessage {
  id: string
  type: 'message' | 'typing' | 'stop-typing'
  username: string
  content: string
  timestamp: number
}

export function useWebSocket(url: string, username: string) {
  const messages = ref<ChatMessage[]>([])
  const isConnected = ref(false)
  const remoteTyping = ref('')

  let ws: WebSocket | null = null
  let typingTimeout: ReturnType<typeof setTimeout> | null = null

  function connect() {
    ws = new WebSocket(url)

    ws.onopen = () => {
      isConnected.value = true
    }

    ws.onclose = () => {
      isConnected.value = false
      // Attempt reconnect after 2s
      setTimeout(connect, 2000)
    }

    ws.onerror = () => {
      isConnected.value = false
    }

    ws.onmessage = (event: MessageEvent) => {
      try {
        const message: ChatMessage = JSON.parse(event.data)

        if (message.type === 'typing') {
          remoteTyping.value = message.username
          if (typingTimeout) clearTimeout(typingTimeout)
          typingTimeout = setTimeout(() => {
            remoteTyping.value = ''
          }, 5000)
          return
        }

        if (message.type === 'stop-typing') {
          remoteTyping.value = ''
          return
        }

        messages.value.push(message)
      } catch (err) {
        console.error('Failed to parse message:', err)
      }
    }
  }

  function sendMessage(content: string) {
    if (!ws || ws.readyState !== WebSocket.OPEN) return

    const message: ChatMessage = {
      id: generateId(),
      type: 'message',
      username,
      content,
      timestamp: Date.now(),
    }

    // Add to local messages immediately
    messages.value.push(message)

    // Send to server
    ws.send(JSON.stringify(message))

    // Stop typing indicator
    sendStopTyping()
  }

  function sendTyping() {
    if (!ws || ws.readyState !== WebSocket.OPEN) return

    const message: ChatMessage = {
      id: generateId(),
      type: 'typing',
      username,
      content: '',
      timestamp: Date.now(),
    }
    ws.send(JSON.stringify(message))
  }

  function sendStopTyping() {
    if (!ws || ws.readyState !== WebSocket.OPEN) return

    const message: ChatMessage = {
      id: generateId(),
      type: 'stop-typing',
      username,
      content: '',
      timestamp: Date.now(),
    }
    ws.send(JSON.stringify(message))
  }

  function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
  }

  onMounted(() => {
    connect()
  })

  onUnmounted(() => {
    if (ws) {
      ws.close()
      ws = null
    }
  })

  return {
    messages,
    isConnected,
    remoteTyping,
    sendMessage,
    sendTyping,
    sendStopTyping,
  }
}
