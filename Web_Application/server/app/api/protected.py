from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from server.app.services.auth_service import get_email_from_token

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

@router.get("/protected")
def protected_route(token: str = Depends(oauth2_scheme)):
    # This will raise 401 if token is invalid
    email = get_email_from_token(token)
    return {"message": f"Hello, {email}. You have accessed a protected route."}
