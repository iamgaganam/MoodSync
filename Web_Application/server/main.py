from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from server.app.api.auth import router as auth_router
from server.app.api.protected import router as protected_router
from server.app.api.sentiment import router as sentiment_router

app = FastAPI()

# CORS configuration (retaining the first file's settings)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5175"],  # or ["*"] for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers from the first main.py
app.include_router(auth_router, prefix="", tags=["auth"])
app.include_router(protected_router, prefix="", tags=["protected"])

# Include extra router from the second main.py
app.include_router(sentiment_router)

# Root endpoint (unchanged from the first main.py)
@app.get("/")
def root():
    return {"message": "Hello from FastAPI + MongoDB + JWT!"}

# Extra health check endpoint from the second main.py added at a different route
@app.get("/health")
async def health_check():
    return {"message": "Hello, this is the mental health prediction API."}
