from fastapi import APIRouter, HTTPException, Depends
from server.app.models.user import UserIn, UserOut, LoginRequest, Token
from server.app.services.auth_service import register_user, login_user

router = APIRouter()

@router.post("/register", response_model=UserOut)
async def register(user: UserIn):
    new_user = await register_user(user)
    if new_user is None:
        raise HTTPException(status_code=400, detail="Email already registered")
    return new_user

@router.post("/login", response_model=Token)
async def login(request: LoginRequest):
    token = await login_user(request)
    if token is None:
        raise HTTPException(status_code=400, detail="Invalid credentials")
    return token
