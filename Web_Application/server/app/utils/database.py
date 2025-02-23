import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()  # Load variables from .env

MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME", "moodsync")

client = MongoClient(MONGO_URI)
db = client[DB_NAME]

# Optionally, ensure a unique index on email
users_collection = db["users"]
users_collection.create_index("email", unique=True)
