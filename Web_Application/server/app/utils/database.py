import os
from pymongo import MongoClient
from dotenv import load_dotenv
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Fixed env variable name to match your .env file
MONGO_URI = os.getenv("MONGODB_URI")
DB_NAME = os.getenv("DB_NAME", "moodsync")

logger.info(f"MongoDB URI: {MONGO_URI if MONGO_URI else 'Not set'}")
logger.info(f"Database name: {DB_NAME}")

if not MONGO_URI:
    logger.error("MONGODB_URI environment variable is not set!")
    # Still continue with the code in case it's set elsewhere

try:
    client = MongoClient(MONGO_URI)
    # Test connection
    client.admin.command('ismaster')
    logger.info("MongoDB connection successful")
except Exception as e:
    logger.error(f"MongoDB connection failed: {str(e)}")

db = client[DB_NAME]

# Ensuring a unique index on email for user collection
users_collection = db["users"]
try:
    users_collection.create_index("email", unique=True)
    logger.info("Created unique index on email field")
except Exception as e:
    logger.error(f"Failed to create index: {str(e)}")