import os
import logging
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ConfigurationError, ServerSelectionTimeoutError
from dotenv import load_dotenv
from datetime import datetime

logger = logging.getLogger(__name__)
load_dotenv()

# Database configuration
MONGO_URI = os.getenv("MONGO_URI") or os.getenv("MONGODB_URI")
DB_NAME = os.getenv("DB_NAME", "moodsync")

if not MONGO_URI:
    logger.error("MongoDB URI environment variable not configured")
    raise ValueError("MONGO_URI environment variable is required")

# MongoDB connection setup
try:
    logger.info(f"Connecting to MongoDB database: {DB_NAME}")
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)

    # Verify connection
    client.admin.command('ping')
    logger.info("MongoDB connection established successfully")

    # Database and collections setup
    db = client[DB_NAME]
    users_collection = db["users"]

    # Community feature collections
    support_groups_collection = db["support_groups"]
    events_collection = db["events"]
    posts_collection = db["posts"]
    comments_collection = db["comments"]
    peer_supporters_collection = db["peer_supporters"]
    chat_rooms_collection = db["chat_rooms"]
    chat_messages_collection = db["chat_messages"]

    # Create database indexes
    if "email_1" not in users_collection.index_information():
        users_collection.create_index("email", unique=True)
        logger.info("Created unique email index")

except (ConnectionFailure, ServerSelectionTimeoutError, ConfigurationError) as e:
    logger.error(f"MongoDB connection failed: {str(e)}")
    raise
except Exception as e:
    logger.error(f"Database setup error: {str(e)}")
    raise


def get_database():
    """Return database instance for async operations"""
    return db


def format_datetime_ago(dt: datetime) -> str:
    """Convert datetime to 'time ago' format"""
    now = datetime.now()
    diff = now - dt

    if diff.days > 30:
        months = diff.days // 30
        return f"{months} {'month' if months == 1 else 'months'} ago"
    elif diff.days > 0:
        return f"{diff.days} {'day' if diff.days == 1 else 'days'} ago"
    elif diff.seconds >= 3600:
        hours = diff.seconds // 3600
        return f"{hours} {'hour' if hours == 1 else 'hours'} ago"
    elif diff.seconds >= 60:
        minutes = diff.seconds // 60
        return f"{minutes} {'minute' if minutes == 1 else 'minutes'} ago"
    else:
        return "Just now"


logger.info("Database configuration completed successfully")