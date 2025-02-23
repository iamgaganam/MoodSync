import os
import datetime
from typing import Optional
from jose import jwt, JWTError
from passlib.context import CryptContext
from server.app.models.user import UserIn, UserOut, Token, TokenData
from server.app.utils.database import users_collection
from fastapi import HTTPException, status

# Load env vars
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: Optional[datetime.timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.datetime.utcnow() + expires_delta
    else:
        expire = datetime.datetime.utcnow() + datetime.timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# Register new user
def register_user(user: UserIn) -> UserOut:
    # Check if email is already in use
    if users_collection.find_one({"email": user.email}):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    hashed_pwd = hash_password(user.password)
    user_data = {
        "username": user.username,
        "email": user.email,
        "password": hashed_pwd,
        "mobileNumber": user.mobileNumber,
        "emergencyContact": user.emergencyContact,
    }

    # Insert user into DB
    users_collection.insert_one(user_data)

    return UserOut(
        username=user.username,
        email=user.email,
        mobileNumber=user.mobileNumber,
        emergencyContact=user.emergencyContact,
    )

# Authenticate user (for login)
def authenticate_user(email: str, password: str) -> bool:
    user = users_collection.find_one({"email": email})
    if not user:
        return False
    if not verify_password(password, user["password"]):
        return False
    return True


# Create a token for user if authenticated
def login_user(email: str, password: str) -> Token:
    if not authenticate_user(email, password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid credentials",
        )
    access_token_expires = datetime.timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": email}, expires_delta=access_token_expires
    )
    return Token(access_token=access_token, token_type="bearer")


# Utility to decode token and get current user email
def get_email_from_token(token: str) -> str:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return email
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
