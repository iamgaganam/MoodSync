from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from server.app.api.sentiment import router as sentiment_router
from server.app.api import auth
from server.app.services.auth_service import SECRET_KEY, ALGORITHM

# Initialize FastAPI app
app = FastAPI()

# Add CORS middleware to allow requests from the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins; replace with frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# OAuth2 bearer token
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# Token verification
def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return email
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# Include authentication routes
app.include_router(auth.router)

# Include the sentiment API router
app.include_router(sentiment_router)

# Home route for logged-in users
@app.get("/home")
async def home(current_user: str = Depends(get_current_user)):
    return {"message": f"Welcome, {current_user}!"}

# Health check endpoint
@app.get("/")
async def root():
    return {"message": "Hello, this is the mental health prediction API."}
