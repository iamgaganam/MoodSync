from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from server.app.api.sentiment import router as sentiment_router
from server.app.api import auth


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

# Include authentication routes
app.include_router(auth.router)

# Include the sentiment API router
app.include_router(sentiment_router)

# Health check endpoint
@app.get("/")
async def root():
    return {"message": "Hello, this is the mental health prediction API."}
