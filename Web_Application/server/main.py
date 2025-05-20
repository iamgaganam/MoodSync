from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
import logging
from server.app.utils.database import db  # Import your database connection
from server.app.api.auth import router as auth_router
from server.app.api.protected import router as protected_router
from server.app.api.sentiment import router as sentiment_router
from server.app.api.chat_socket import router as chat_socket_router
from server.app.api.professionals import router as professionals_router
from server.app.api.users import router as users_router
from server.app.api.emergency_contacts import router as emergency_contacts_router

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

app = FastAPI(title="Mental Health Support API")

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
os.makedirs("uploads/user_profile_images", exist_ok=True)  # Directory for user profile images
logger.info("Created upload directories")

# Mount static files
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
logger.info("Mounted static files directory at /uploads")

# Include the different API routers
app.include_router(auth_router, tags=["auth"])
app.include_router(protected_router, tags=["protected"])
app.include_router(sentiment_router)
app.include_router(chat_socket_router, tags=["chat-socket"])
app.include_router(professionals_router, prefix="/api/professionals", tags=["professionals"])
app.include_router(users_router, prefix="/api/users", tags=["users"])
app.include_router(emergency_contacts_router, prefix="/api/emergency-contacts", tags=["emergency-contacts"])
logger.info("All API routers have been registered")

@app.get("/")
def root():
    return {"message": "FastAPI + MongoDB + JWT Auth"}

@app.get("/health")
async def health_check():
    try:
        # Check database connection
        db.command("ping")
        # If we got here, the database connection is working
        logger.info("Health check successful")
        return {
            "status": "healthy",
            "message": "API is up and running!",
            "database": "connected",
            "api_version": "1.0.0"
        }
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        return {
            "status": "unhealthy",
            "message": f"API health check failed: {str(e)}",
            "database": "disconnected"
        }

logger.info("FastAPI application initialized and ready")