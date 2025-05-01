import os
import datetime
from typing import Optional
from jose import jwt, JWTError
from passlib.context import CryptContext
from server.app.models.user import UserIn, UserOut, Token
from server.app.utils.database import users_collection
from fastapi import HTTPException, status
import logging
from dotenv import load_dotenv

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Check for both JWT_SECRET and SECRET_KEY to handle potential naming differences
SECRET_KEY = os.getenv("JWT_SECRET") or os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))

# Log environment variable loading
logger.info(f"ALGORITHM loaded: {ALGORITHM}")
logger.info(f"ACCESS_TOKEN_EXPIRE_MINUTES loaded: {ACCESS_TOKEN_EXPIRE_MINUTES}")
logger.info(f"SECRET_KEY loaded: {'Successfully' if SECRET_KEY else 'FAILED'}")

if not SECRET_KEY:
    logger.error("JWT_SECRET/SECRET_KEY environment variable is not set!")
    raise ValueError("JWT_SECRET/SECRET_KEY environment variable is not set")

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# Utility functions for password handling
def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


# JWT Token creation
def create_access_token(data: dict, expires_delta: Optional[datetime.timedelta] = None) -> str:
    if not SECRET_KEY:
        logger.error("SECRET_KEY is not set!")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Server configuration error",
        )

    to_encode = data.copy()
    expire = datetime.datetime.utcnow() + (expires_delta or datetime.timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


# Register new user
def register_user(user: UserIn) -> UserOut:
    logger.info(f"Attempting to register user with email: {user.email}")

    # Check if user already exists
    existing_user = users_collection.find_one({"email": user.email})
    if existing_user:
        logger.warning(f"Registration failed: Email already registered: {user.email}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    # Prepare user data
    user_data = {
        "username": user.username,
        "email": user.email,
        "password": hash_password(user.password),
        "mobileNumber": user.mobileNumber,
        "emergencyContact": user.emergencyContact,
    }

    # Insert user into database
    try:
        result = users_collection.insert_one(user_data)
        logger.info(f"User registered successfully with ID: {result.inserted_id}")

        # Verify insertion
        if not result.acknowledged:
            logger.error(f"MongoDB insertion was not acknowledged for user: {user.email}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to register user",
            )

        # Return user data without password
        user_out_data = user_data.copy()
        user_out_data.pop("password", None)
        return UserOut(**user_out_data)

    except Exception as e:
        logger.error(f"Error registering user: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to register user",
        )


# Authenticate user and create access token
def login_user(email: str, password: str) -> Token:
    logger.info(f"Login attempt for user: {email}")

    # Find user in database
    user = users_collection.find_one({"email": email})

    # Debug information
    if not user:
        logger.warning(f"Login failed: User not found: {email}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid credentials",
        )

    # Verify password
    if not verify_password(password, user["password"]):
        logger.warning(f"Login failed: Invalid password for user: {email}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid credentials",
        )

    # Create and return token
    access_token = create_access_token(
        data={"sub": email},
        expires_delta=datetime.timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    logger.info(f"Login successful for user: {email}")
    return Token(access_token=access_token, token_type="bearer")


# Decode the token to get email
def get_email_from_token(token: str) -> str:
    if not SECRET_KEY:
        logger.error("SECRET_KEY is not set!")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Server configuration error",
        )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if not email:
            logger.warning("Token validation failed: Missing subject claim")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )
        return email
    except JWTError as e:
        logger.warning(f"Token validation failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )