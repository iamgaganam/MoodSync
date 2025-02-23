from fastapi import APIRouter, HTTPException
from server.app.models.user import UserIn, UserOut, LoginRequest, Token
from server.app.services.auth_service import register_user, login_user

router = APIRouter()

@router.post("/register", response_model=UserOut)
def register(user: UserIn):
    return register_user(user)

@router.post("/login", response_model=Token)
def login(request: LoginRequest):
    return login_user(request.email, request.password)
