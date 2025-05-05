from pydantic import BaseModel, EmailStr

class UserBase(BaseModel):
    username: str
    email: EmailStr
    mobileNumber: str
    emergencyContact: str

class UserIn(UserBase):
    password: str

class UserOut(UserBase):
    pass

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: str | None = None

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

# Add this function to your existing user.py file
def get_professional_collection():
    from ..utils.database import get_database
    db = get_database()
    return db["professionals"]