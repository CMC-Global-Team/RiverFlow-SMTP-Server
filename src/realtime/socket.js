import { Server } from 'socket.io'
import jwt from 'jsonwebtoken'

function getBackendConfig() {
  const backendUrl = process.env.APP_BACKEND_URL || 'https://riverflow-server.onrender.com/api'
  const jwtSecret = process.env.JWT_SECRET || null
  return { backendUrl, jwtSecret }
}

export function initRealtimeServer(httpServer, corsOrigins) {
  const io = new Server(httpServer, {
    cors: { origin: corsOrigins, credentials: true },
    path: '/socket.io'
  })

  const { backendUrl, jwtSecret } = getBackendConfig()

  io.of('/realtime').use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token || socket.handshake.headers['authorization']?.replace('Bearer ', '')
      socket.data.user = null
      if (token && jwtSecret) {
        const payload = jwt.verify(token, jwtSecret)
        socket.data.user = { id: payload?.sub || payload?.userId || payload?.id }
      }
      next()
    } catch (e) {
      next()
    }
  })

  io.of('/realtime').on('connection', (socket) => {
    socket.on('mindmap:join', async (payload) => {
      try {
        const { mindmapId, shareToken } = payload || {}
        let room = null
        let canEdit = false
        let ok = false
        let headers = {}
        if (backendUrl) {
          if (shareToken) {
            const res = await fetch(`${backendUrl}/mindmaps/public/${shareToken}`)
            ok = res.ok
            if (ok) {
              const data = await res.json()
              room = `mindmap:${data.id}`
              canEdit = data.publicAccessLevel === 'edit'
            }
          } else if (mindmapId) {
            const token = socket.handshake.auth?.token
            if (token) headers['Authorization'] = `Bearer ${token}`
            const res = await fetch(`${backendUrl}/mindmaps/${mindmapId}`, { headers })
            ok = res.ok
            if (ok) {
              const data = await res.json()
              room = `mindmap:${data.id}`
              const uid = socket.data.user?.id
              canEdit = Boolean(uid && (uid === data.mysqlUserId || (data.collaborators || []).some(c => c.mysqlUserId === uid && c.role === 'EDITOR')))
              if (!canEdit && data.publicAccessLevel === 'edit') canEdit = true
            }
          }
        }
        if (!room) return
        await socket.join(room)
        socket.emit('mindmap:joined', { room, canEdit })
      } catch {}
    })

    socket.on('mindmap:nodes:change', (room, changes) => {
      socket.broadcast.to(room).emit('mindmap:nodes:change', changes)
    })

    socket.on('mindmap:edges:change', (room, changes) => {
      socket.broadcast.to(room).emit('mindmap:edges:change', changes)
    })

    socket.on('mindmap:connect', (room, connection) => {
      socket.broadcast.to(room).emit('mindmap:connect', connection)
    })

    socket.on('mindmap:viewport', (room, viewport) => {
      socket.broadcast.to(room).emit('mindmap:viewport', viewport)
    })

    socket.on('cursor:move', (room, data) => {
      socket.broadcast.to(room).emit('cursor:move', data)
    })
  })
}

export default initRealtimeServer
