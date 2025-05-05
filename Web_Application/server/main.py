from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
from server.app.api.auth import router as auth_router
from server.app.api.protected import router as protected_router
from server.app.api.sentiment import router as sentiment_router
from server.app.api.chat_socket import router as chat_socket_router
from server.app.api.professionals import router as professionals_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Make sure this matches your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create upload directories
os.makedirs("uploads/profile_images", exist_ok=True)
os.makedirs("uploads/license_certificates", exist_ok=True)

# Mount static files
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Include the different API routers
app.include_router(auth_router, tags=["auth"])
app.include_router(protected_router, tags=["protected"])
app.include_router(sentiment_router)
app.include_router(chat_socket_router, tags=["chat-socket"])
app.include_router(professionals_router, prefix="/api/professionals", tags=["professionals"])

@app.get("/")
def root():
    return {"message": "FastAPI + MongoDB + JWT Auth"}

@app.get("/health")
async def health_check():
    return {"message": "API is up and running!"}