from fastapi import APIRouter, HTTPException, status
import logging
from server.app.models.user import UserIn, UserOut, LoginRequest, Token
from server.app.services.auth_service import register_user, login_user

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def register(user: UserIn):
    """Register new user account with validation"""
    try:
        logger.info(f"User registration attempt: {user.email}")
        result = register_user(user)
        logger.info(f"User registered successfully: {user.email}")
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Registration failed for {user.email}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Registration failed"
        )


@router.post("/login", response_model=Token)
def login(request: LoginRequest):
    """Authenticate user and return access token"""
    try:
        logger.info(f"Login attempt: {request.email}")
        result = login_user(request.email, request.password)
        logger.info(f"Login successful: {request.email}")
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Login failed for {request.email}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Authentication failed"
        )