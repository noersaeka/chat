import { WebSocketServer, WebSocket } from 'ws'

interface ChatMessage {
  id: string
  type: 'message' | 'typing' | 'stop-typing'
  username: string
  content: string
  timestamp: number
}

const PORT = parseInt(process.env.PORT ?? '3001')
const wss = new WebSocketServer({ port: PORT })

console.log(`🚀 WebSocket server running on ws://localhost:${PORT}`)

wss.on('connection', (ws: WebSocket) => {
  console.log(`✅ Client connected. Total clients: ${wss.clients.size}`)

  ws.on('message', (data: Buffer) => {
    try {
      const message: ChatMessage = JSON.parse(data.toString())

      // Broadcast to all OTHER connected clients
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(message))
        }
      })
    } catch (err) {
      console.error('Failed to parse message:', err)
    }
  })

  ws.on('close', () => {
    console.log(`❌ Client disconnected. Total clients: ${wss.clients.size}`)
  })

  ws.on('error', (err) => {
    console.error('WebSocket error:', err)
  })
})
