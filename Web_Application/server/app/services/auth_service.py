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

logger = logging.getLogger(__name__)
load_dotenv()

# JWT Configuration
SECRET_KEY = os.getenv("JWT_SECRET") or os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))

if not SECRET_KEY:
    logger.error("JWT SECRET_KEY environment variable not configured")
    raise ValueError("JWT SECRET_KEY environment variable is required")

# Password hashing configuration
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    """Hash password by using bcrypt"""
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password against hash"""
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict, expires_delta: Optional[datetime.timedelta] = None) -> str:
    """Generate JWT access token with expiration"""
    if not SECRET_KEY:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Server configuration error"
        )

    to_encode = data.copy()
    expire = datetime.datetime.utcnow() + (
            expires_delta or datetime.timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    to_encode.update({"exp": expire})

    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def register_user(user: UserIn) -> UserOut:
    """Register new user with validation and secure password storage"""
    logger.info(f"Registration attempt: {user.email}")

    # Check for existing user
    if users_collection.find_one({"email": user.email}):
        logger.warning(f"Registration failed - email exists: {user.email}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Prepare user data with hashed password
    user_data = {
        "username": user.username,
        "email": user.email,
        "password": hash_password(user.password),
        "mobileNumber": user.mobileNumber,
        "emergencyContact": user.emergencyContact,
    }

    try:
        result = users_collection.insert_one(user_data)

        if not result.acknowledged:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to register user"
            )

        logger.info(f"User registered successfully: {user.email}")

        # Return user data without password
        user_response = user_data.copy()
        user_response.pop("password", None)
        return UserOut(**user_response)

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Registration error for {user.email}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to register user"
        )


def login_user(email: str, password: str) -> Token:
    """Authenticate user and return JWT token"""
    logger.info(f"Login attempt: {email}")

    # Find user in database
    user = users_collection.find_one({"email": email})

    if not user or not verify_password(password, user["password"]):
        logger.warning(f"Login failed: {email}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid credentials"
        )

    # Generate access token
    access_token = create_access_token(
        data={"sub": email},
        expires_delta=datetime.timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    logger.info(f"Login successful: {email}")
    return Token(access_token=access_token, token_type="bearer")


def get_email_from_token(token: str) -> str:
    """Decode JWT token and extract user email"""
    if not SECRET_KEY:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Server configuration error"
        )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")

        if not email:
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