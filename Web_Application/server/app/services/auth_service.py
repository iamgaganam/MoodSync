from passlib.context import CryptContext
from pymongo import MongoClient
from jose import JWTError, jwt
import datetime
from typing import Optional
from server.app.models.user import LoginRequest, Token, UserIn

# MongoDB URI
uri = "mongodb+srv://gaganam220:h55wI4KfDS0hNQoj@cluster0.n8omm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(uri)
db = client['moodsync']
users_collection = db['users']

# Initialize password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Secret key for JWT
SECRET_KEY = "bf7d6a7ca3bcc57b195ca47b9b9f2832c9194095bbb65891618b5e31b310aebb"
ALGORITHM = "HS256"

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
    }
    users_collection.insert_one(user_data)
    return {"username": user.username, "email": user.email}

# Business logic for user login
async def login_user(request: LoginRequest) -> Optional[Token]:
    user = users_collection.find_one({"email": request.email})
    if not user or not verify_password(request.password, user["password"]):
        return None  # Invalid credentials
    access_token = create_access_token(data={"sub": request.email})
    return Token(access_token=access_token, token_type="bearer")
