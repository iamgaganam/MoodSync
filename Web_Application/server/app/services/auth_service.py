from passlib.context import CryptContext
from pymongo import MongoClient
from jose import JWTError, jwt
import datetime
import os
from typing import Optional
from dotenv import load_dotenv
from server.app.models.user import LoginRequest, Token, UserIn

# Load environment variables from .env file
load_dotenv()

# MongoDB URI and credentials
uri = os.getenv("MONGO_URI")
client = MongoClient(uri)
db = client['moodsync']
users_collection = db['users']

# Initialize password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Secret key for JWT
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")

# Password hashing and verification functions
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

# JWT token creation
def create_access_token(data: dict) -> str:
    expire = datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    to_encode = data.copy()
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# Business logic for user registration
async def register_user(user: UserIn) -> Optional[dict]:
    if users_collection.find_one({"email": user.email}):
        return None  # User already exists
    hashed_password = hash_password(user.password)
    user_data = {
        "username": user.username,
        "email": user.email,
        "password": hashed_password,
        "mobileNumber": user.mobileNumber,
        "emergencyContact": user.emergencyContact,
    }
    users_collection.insert_one(user_data)
    return {"username": user.username, "email": user.email, "mobileNumber": user.mobileNumber, "emergencyContact": user.emergencyContact}

# Business logic for user login
async def login_user(request: LoginRequest) -> Optional[Token]:
    user = users_collection.find_one({"email": request.email})
    if not user or not verify_password(request.password, user["password"]):
        return None  # Invalid credentials
    access_token = create_access_token(data={"sub": request.email})
    return Token(access_token=access_token, token_type="bearer")
