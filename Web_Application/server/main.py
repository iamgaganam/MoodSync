import os
import logging
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from server.app.utils.database import db
from server.app.api.auth import router as auth_router
from server.app.api.protected import router as protected_router
from server.app.api.sentiment import router as sentiment_router
from server.app.api.chat_socket import router as chat_socket_router
from server.app.api.professionals import router as professionals_router
from server.app.api.users import router as users_router
from server.app.api.emergency_contacts import router as emergency_contacts_router
from server.app.api.community import router as community_router

# Application Configuration
APP_NAME = "MoodSync API"
APP_VERSION = "1.0.0"
FRONTEND_URL = "http://localhost:5173"
LOG_FORMAT = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"

UPLOAD_DIRS = [
    "uploads/profile_images",
    "uploads/license_certificates",
    "uploads/user_profile_images"
]

# logging
logging.basicConfig(level=logging.INFO, format=LOG_FORMAT)
logger = logging.getLogger(__name__)

# FastAPI application
app = FastAPI(
    title=APP_NAME,
    version=APP_VERSION,
    description="Comprehensive mental health support platform with professional services"
)

# CORS configuration for security
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)


def create_upload_directories() -> None:
    """I created upload directories with proper error handling"""
    for directory in UPLOAD_DIRS:
        os.makedirs(directory, exist_ok=True)
    logger.info("Upload directories initialized")


def register_api_routes() -> None:
    """Register all API endpoints with prefixes and tags"""
    # Core routes without prefix
    core_routes = [
        (auth_router, "auth"),
        (protected_router, "protected"),
        (sentiment_router, "sentiment"),
        (chat_socket_router, "chat-socket")
    ]

    # API routes with prefix
    api_routes = [
        (professionals_router, "/api/professionals", "professionals"),
        (users_router, "/api/users", "users"),
        (emergency_contacts_router, "/api/emergency-contacts", "emergency-contacts"),
        (community_router, "/api/community", "community")
    ]

    # Register core routes
    for router, tag in core_routes:
        app.include_router(router, tags=[tag])

    # Register API routes
    for router, prefix, tag in api_routes:
        app.include_router(router, prefix=prefix, tags=[tag])

    logger.info("API routes registered successfully")


# Initialize application components
create_upload_directories()
register_api_routes()

# Static file serving for uploads
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")


@app.get("/")
async def root():
    """API root endpoint with basic information"""
    return {
        "message": f"Welcome to {APP_NAME}",
        "version": APP_VERSION,
        "status": "operational"
    }


@app.get("/health")
async def health_check():
    """Health check with database connectivity validation"""
    try:
        # Verify database connection
        db.command("ping")
        logger.info("Health check passed")

        return {
            "status": "healthy",
            "message": "System operational",
            "database": "connected",
            "version": APP_VERSION
        }
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        raise HTTPException(
            status_code=503,
            detail="Service temporarily unavailable"
        )


@app.on_event("startup")
async def startup_event():
    """Application startup initialization"""
    try:
        logger.info(f"{APP_NAME} v{APP_VERSION} started successfully")
    except Exception as e:
        logger.error(f"Startup error: {str(e)}")
        logger.warning("Application started with limited functionality")


@app.on_event("shutdown")
async def shutdown_event():
    """Application cleanup on shutdown"""
    logger.info("Application shutdown completed")