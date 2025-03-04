import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME", "moodsync")

client = MongoClient(MONGO_URI)
db = client[DB_NAME]

# Ensuring a unique index on email for user collection
users_collection = db["users"]
users_collection.create_index("email", unique=True)
