from pydantic import BaseModel

class UserIn(BaseModel):
    username: str
    email: str
    password: str
    mobileNumber: str
    emergencyContact: str

class UserOut(BaseModel):
    username: str
    email: str
    mobileNumber: str
    emergencyContact: str

class LoginRequest(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
