from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from server.app.api.auth import router as auth_router
from server.app.api.protected import router as protected_router
from server.app.api.sentiment import router as sentiment_router
from server.app.api.chat_socket import router as chat_socket_router  # New WebSocket endpoint

app = FastAPI()

# CORS middleware setup for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Adjust frontend origin as needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the different API routers
app.include_router(auth_router, tags=["auth"])  # Direct endpoints e.g., /login and /register
app.include_router(protected_router, tags=["protected"])  # Direct endpoints e.g., /protected
app.include_router(sentiment_router)
app.include_router(chat_socket_router, tags=["chat-socket"])  # New chat WebSocket endpoints

@app.get("/")
def root():
    return {"message": "FastAPI + MongoDB + JWT Auth"}

@app.get("/health")
async def health_check():
    return {"message": "API is up and running!"}
