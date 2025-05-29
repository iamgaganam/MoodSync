from pydantic import BaseModel, EmailStr
from typing import Optional


class UserBase(BaseModel):
    """Base user model with common fields"""
    username: str
    email: EmailStr
    mobileNumber: str
    emergencyContact: str


class UserIn(UserBase):
    """User input model for registration"""
    password: str


class UserOut(UserBase):
    """User output model (excludes sensitive data)"""
    pass


class Token(BaseModel):
    """JWT token response model"""
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    """Token payload data model"""
    email: Optional[str] = None


class LoginRequest(BaseModel):
    """User login request model"""
    email: EmailStr
    password: str