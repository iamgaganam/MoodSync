import os
import datetime
from typing import Optional
from jose import jwt, JWTError
from passlib.context import CryptContext
from server.app.models.user import UserIn, UserOut, Token
from server.app.utils.database import users_collection
from fastapi import HTTPException, status
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Fixed env variable name to match your .env file
SECRET_KEY = os.getenv("JWT_SECRET")
if not SECRET_KEY:
    SECRET_KEY = "moodsync_super_secret_key_for_development_only_please_change_in_production"
    logger.warning("Using default SECRET_KEY. This is insecure for production.")

ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# Utility functions for password handling
def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


# JWT Token creation
def create_access_token(data: dict, expires_delta: Optional[datetime.timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.datetime.utcnow() + (expires_delta or datetime.timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    try:
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        logger.info(f"Token created successfully for {data.get('sub', 'unknown')}")
        return encoded_jwt
    except Exception as e:
        logger.error(f"Token generation failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Token generation failed: {str(e)}"
        )


# Register new user
def register_user(user: UserIn) -> UserOut:
    logger.info(f"Attempting to register user: {user.email}")

    if users_collection.find_one({"email": user.email}):
        logger.warning(f"Registration failed: Email already registered: {user.email}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    user_data = {
        "username": user.username,
        "email": user.email,
        "password": hash_password(user.password),
        "mobileNumber": user.mobileNumber,
        "emergencyContact": user.emergencyContact,
    }

    try:
        result = users_collection.insert_one(user_data)
        logger.info(f"User registered successfully: {user.email}, ID: {result.inserted_id}")
    except Exception as e:
        logger.error(f"Database error during registration: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}"
        )

    # Don't return the password in the response
    return_data = user_data.copy()
    del return_data["password"]
    return UserOut(**return_data)


# Authenticate user and create access token
def login_user(email: str, password: str) -> Token:
    logger.info(f"Login attempt for: {email}")

    user = users_collection.find_one({"email": email})
    if not user:
        logger.warning(f"Login failed: User not found: {email}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid credentials",
        )

    if not verify_password(password, user["password"]):
        logger.warning(f"Login failed: Invalid password for: {email}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid credentials",
        )

    access_token = create_access_token(data={"sub": email},
                                       expires_delta=datetime.timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    logger.info(f"Login successful for: {email}")
    return Token(access_token=access_token, token_type="bearer")


# Decode the token to get email
def get_email_from_token(token: str) -> str:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if not email:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
        return email
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")