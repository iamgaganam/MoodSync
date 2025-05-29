from fastapi import APIRouter, WebSocket, WebSocketDisconnect

router = APIRouter()


class ConnectionManager:
    """ WebSocket connections for real-time chat functionality"""

    def __init__(self):
        # Maps room IDs to lists of active WebSocket connections
        self.active_connections: dict[str, list[WebSocket]] = {}

    async def connect(self, room_id: str, websocket: WebSocket):
        """Accept new WebSocket connection and add to room"""
        await websocket.accept()
        if room_id not in self.active_connections:
            self.active_connections[room_id] = []
        self.active_connections[room_id].append(websocket)

    def disconnect(self, room_id: str, websocket: WebSocket):
        """Remove WebSocket connection from room"""
        if room_id in self.active_connections:
            self.active_connections[room_id].remove(websocket)
            # Clean up empty rooms
            if not self.active_connections[room_id]:
                del self.active_connections[room_id]

    async def broadcast(self, room_id: str, message: str, sender: WebSocket):
        """Send message to all connections in room except sender"""
        if room_id in self.active_connections:
            for connection in self.active_connections[room_id]:
                if connection != sender:
                    await connection.send_text(message)


# Global connection manager instance
manager = ConnectionManager()


@router.websocket("/ws/{room_id}")
async def websocket_endpoint(websocket: WebSocket, room_id: str):
    """Handle WebSocket connections for chat rooms"""
    await manager.connect(room_id, websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # Broadcast message to other room participants
            await manager.broadcast(room_id, data, websocket)
    except WebSocketDisconnect:
        manager.disconnect(room_id, websocket)