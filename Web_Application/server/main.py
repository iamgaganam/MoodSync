from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.sentiment import router as sentiment_router  # Corrected import

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

# Include the sentiment API router
app.include_router(sentiment_router)

# Health check endpoint
@app.get("/")
async def root():
    return {"message": "Hello, this is the mental health prediction API."}
