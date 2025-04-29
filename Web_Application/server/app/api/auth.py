from fastapi import APIRouter, HTTPException, status, Request
from server.app.models.user import UserIn, UserOut, LoginRequest, Token
from server.app.services.auth_service import register_user, login_user
import logging
import json

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/register", response_model=UserOut)
async def register(request: Request, user: UserIn):
    body = await request.json()
    logger.info(f"Received registration request: {json.dumps(body)}")

    try:
        result = register_user(user)
        logger.info(f"Registration successful for: {user.email}")
        return result
    except HTTPException as e:
        logger.error(f"Registration failed with HTTP exception: {e.detail}")
        raise
    except Exception as e:
        logger.error(f"Unexpected error during registration: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Registration failed: {str(e)}"
        )


@router.post("/login", response_model=Token)
async def login(request: Request, login_request: LoginRequest):
    body = await request.json()
    logger.info(f"Received login request: {json.dumps(body)}")

    try:
        result = login_user(login_request.email, login_request.password)
        logger.info(f"Login successful for: {login_request.email}")
        return result
    except HTTPException as e:
        logger.error(f"Login failed with HTTP exception: {e.detail}")
        raise
    except Exception as e:
        logger.error(f"Unexpected error during login: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Login failed: {str(e)}"
        )