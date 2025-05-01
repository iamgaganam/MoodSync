import os
import logging
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ConfigurationError, ServerSelectionTimeoutError
from dotenv import load_dotenv

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Get MongoDB connection string from environment variables
# Note: Check both MONGO_URI (your code) and MONGODB_URI (from .env)
MONGO_URI = os.getenv("MONGO_URI") or os.getenv("MONGODB_URI")
DB_NAME = os.getenv("DB_NAME", "moodsync")

if not MONGO_URI:
    logger.error("MONGO_URI environment variable is not set!")
    raise ValueError("MONGO_URI environment variable is not set")

try:
    # Connect to MongoDB with timeout
    logger.info(f"Attempting to connect to MongoDB for database: {DB_NAME}...")
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)

    # Check connection by pinging
    client.admin.command('ping')
    logger.info(f"Successfully connected to MongoDB database: {DB_NAME}")

    # Get database and collections
    db = client[DB_NAME]
    users_collection = db["users"]

    # Create indexes if they don't exist
    if "email_1" not in users_collection.index_information():
        users_collection.create_index("email", unique=True)
        logger.info("Created unique index on email field")
    else:
        logger.info("Email index already exists")

except ConnectionFailure as e:
    logger.error(f"MongoDB Connection Error: {str(e)}")
    raise
except ServerSelectionTimeoutError as e:
    logger.error(f"MongoDB Server Selection Timeout: {str(e)}")
    raise
except ConfigurationError as e:
    logger.error(f"MongoDB Configuration Error: {str(e)}")
    raise
except Exception as e:
    logger.error(f"Unexpected error when connecting to MongoDB: {str(e)}")
    raise

logger.info("Database setup complete")